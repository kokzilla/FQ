import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { createSignedSession } from '../../utils/auth'
import { localUsers } from '../users/index.get'

export default defineEventHandler(async (event) => {
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

  // 2. โหมด Local Admin หรือ Fallback (เฉพาะกรณีไม่ได้ตั้ง BRU_SSO_API_KEY หรือล็อกอินด้วยบัญชี admin)
  if (!userData) {
    const adminPassword = (config.adminPassword as string) || process.env.ADMIN_PASSWORD || 'admin'
    const isLocalAdmin = cleanUsername === 'admin' && password === adminPassword
    const isDevFallback = !config.bruSsoApiKey && (password === 'bru123' || password === 'admin')

    if (isLocalAdmin || isDevFallback) {
      const localMatch = localUsers.find(u => u.userlogin === cleanUsername)
      userData = {
        userlogin: cleanUsername,
        fullName: localMatch ? localMatch.fullName : (cleanUsername === 'admin' ? 'ผู้ดูแลระบบ อาคารสถานที่' : `อาจารย์/เจ้าหน้าที่ (${cleanUsername})`),
        email: `${cleanUsername}@bru.ac.th`,
        positionName: localMatch ? localMatch.positionName : (cleanUsername === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่ผู้ตรวจประเมิน'),
      }
    } else {
      throw createError({ statusCode: 401, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (BRU SSO)' })
    }
  }

  // 3. ซิงค์ลงฐานข้อมูลตาราง User
  const localMatch = localUsers.find(u => u.userlogin === userData.userlogin)
  const defaultRole = localMatch ? localMatch.role : (userData.userlogin === 'admin' ? 'ADMIN' : 'AUDITOR')
  let user: any = null

  if (await isDbReady()) {
    try {
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
        },
      })
    } catch (dbErr) {
      user = null
    }
  }

  if (!user) {
    // กรณีที่ยังไม่ได้เชื่อมต่อ Postgres Database จริง ให้ใช้ Memory Session จำลอง
    user = {
      id: localMatch ? localMatch.id : `mock-${userData.userlogin}`,
      userlogin: userData.userlogin,
      fullName: localMatch ? localMatch.fullName : userData.fullName,
      email: userData.email,
      role: defaultRole,
    }
  }

  const signedSession = createSignedSession({
    id: user.id,
    userlogin: user.userlogin,
    fullName: user.fullName,
    role: user.role,
  })

  // กำหนด Session Cookie พร้อมลายเซ็นป้องกันการแก้ไขคุกกี้
  setCookie(event, 'bru_user_session', JSON.stringify(signedSession), {
    httpOnly: false, // อ่านได้ที่ client เพื่อความสะดวกใน minimal UI แต่มี sig ป้องกันการปลอมแปลง
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 วัน
    path: '/',
  })

  return {
    ok: true,
    user: signedSession,
  }
})
