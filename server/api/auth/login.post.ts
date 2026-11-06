import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { createSignedSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // บังคับว่าต้องเชื่อมต่อฐานข้อมูลได้เท่านั้นก่อนดำเนินการ
  await requireDatabase()

  const body = await readBody(event)
  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน' })
  }

  const cleanUsername = String(username).trim()
  const config = useRuntimeConfig()
  let userData: any = null

  // 1. ตรวจสอบผ่าน BRU SSO API หากมี API Key
  if (config.bruSsoApiKey) {
    try {
      const ssoRes: any = await $fetch(`${config.bruSsoBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.bruSsoApiKey,
        },
        body: { username: cleanUsername, password },
      })

      if (ssoRes?.ok && ssoRes?.data) {
        userData = {
          userlogin: ssoRes.data.userlogin || cleanUsername,
          fullName: ssoRes.data.full_name || cleanUsername,
          email: ssoRes.data.email || `${cleanUsername}@bru.ac.th`,
          departmentId: ssoRes.data.department_id || null,
          positionName: ssoRes.data.position_name || null,
        }
      }
    } catch (err: any) {
      console.warn('BRU SSO API authentication failed:', err?.message || err)
    }
  }

  // 2. โหมด Local Admin หรือ Fallback สำหรับกรณีบัญชี admin
  if (!userData) {
    const adminPassword = (config.adminPassword as string) || process.env.ADMIN_PASSWORD || 'admin'
    const isLocalAdmin = cleanUsername === 'admin' && password === adminPassword
    const isDevFallback = !config.bruSsoApiKey && (password === 'bru123' || password === 'admin')

    if (isLocalAdmin || isDevFallback) {
      userData = {
        userlogin: cleanUsername,
        fullName: cleanUsername === 'admin' ? 'ผู้ดูแลระบบ อาคารสถานที่' : `อาจารย์/เจ้าหน้าที่ (${cleanUsername})`,
        email: `${cleanUsername}@bru.ac.th`,
        positionName: cleanUsername === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่ผู้ตรวจประเมิน',
        role: cleanUsername === 'admin' ? 'ADMIN' : 'AUDITOR'
      }
    } else {
      throw createError({ statusCode: 401, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (BRU SSO)' })
    }
  }

  // 3. ซิงค์และดึงข้อมูลลงฐานข้อมูลจริงใน PostgreSQL
  let user: any = null
  try {
    const defaultRole = userData.role || (userData.userlogin === 'admin' ? 'ADMIN' : 'AUDITOR')
    user = await prisma.user.upsert({
      where: { userlogin: userData.userlogin },
      update: {
        fullName: userData.fullName,
        email: userData.email,
        positionName: userData.positionName,
      },
      create: {
        userlogin: userData.userlogin,
        fullName: userData.fullName,
        email: userData.email,
        role: defaultRole,
        positionName: userData.positionName,
        departmentId: userData.departmentId || null,
      },
    })
  } catch (dbErr: any) {
    console.error('Failed to sync user with PostgreSQL:', dbErr)
    throw createError({
      statusCode: 503,
      message: 'ไม่สามารถบันทึกหรือตรวจสอบผู้ใช้กับฐานข้อมูล PostgreSQL ได้: ' + dbErr.message
    })
  }

  const signedSession = createSignedSession({
    id: user.id,
    userlogin: user.userlogin,
    fullName: user.fullName,
    role: user.role,
  })

  // กำหนด Session Cookie พร้อมลายเซ็นป้องกันการแก้ไขคุกกี้
  setCookie(event, 'bru_user_session', JSON.stringify(signedSession), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 วัน
    path: '/',
  })

  return {
    ok: true,
    user: signedSession,
  }
})
