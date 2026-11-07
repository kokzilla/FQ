import { defineEventHandler, readBody, createError, getCookie, setCookie } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { createSignedSession, getVerifiedSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  // 1. ตรวจสอบสิทธิ์ผู้ดูแลระบบเดิม
  const currentSession = getVerifiedSession(event)
  const adminCookieRaw = getCookie(event, 'bru_admin_session')
  
  let originalAdmin: any = null
  if (adminCookieRaw) {
    try {
      originalAdmin = JSON.parse(decodeURIComponent(adminCookieRaw))
    } catch {
      try { originalAdmin = JSON.parse(adminCookieRaw) } catch {}
    }
  }

  const isCurrentAdmin = currentSession?.role === 'ADMIN'
  const isPreviouslyAdmin = originalAdmin && (originalAdmin.role === 'ADMIN' || originalAdmin.userlogin === 'admin')

  if (!isCurrentAdmin && !isPreviouslyAdmin) {
    throw createError({
      statusCode: 403,
      message: 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถสวมบทบาทเป็นผู้ประเมินได้'
    })
  }

  // กำหนดข้อมูลแอดมินต้นฉบับที่จะเก็บไว้สำหรับคืนสิทธิ์
  const adminToSave = isCurrentAdmin ? currentSession : originalAdmin

  const body = (await readBody(event).catch(() => ({}))) || {}
  const { userId, userlogin } = body

  // 2. ค้นหาผู้ใช้ที่ต้องการสวมบทบาท
  let targetUser: any = null
  if (userId) {
    targetUser = await prisma.user.findUnique({ where: { id: userId } })
  } else if (userlogin) {
    targetUser = await prisma.user.findUnique({ where: { userlogin } })
  }

  // หากไม่ได้ระบุ หรือค้นหาไม่พบ ให้เลือกกรรมการท่านแรก (AUDITOR)
  if (!targetUser) {
    targetUser = await prisma.user.findFirst({
      where: { role: 'AUDITOR' }
    })
  }

  // หากไม่มีกรรมการเลย ให้สร้างผู้ประเมินจำลองสำหรับทดสอบ
  if (!targetUser) {
    targetUser = await prisma.user.upsert({
      where: { userlogin: 'evaluator_demo' },
      update: {},
      create: {
        userlogin: 'evaluator_demo',
        fullName: 'คณะกรรมการตรวจประเมิน (ทดสอบ)',
        role: 'AUDITOR',
        positionName: 'กรรมการผู้ตรวจประเมิน',
        email: 'evaluator_demo@bru.ac.th'
      }
    })
  }

  // 3. บันทึก Cookie สำรองสำหรับ Admin
  setCookie(event, 'bru_admin_session', JSON.stringify({
    id: adminToSave.id,
    userlogin: adminToSave.userlogin,
    fullName: adminToSave.fullName,
    role: 'ADMIN',
    positionName: adminToSave.positionName || 'ผู้ดูแลระบบ'
  }), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 ชั่วโมง
    path: '/'
  })

  // 4. สร้างเซสชันผู้ประเมิน
  const impersonatedSession = createSignedSession({
    id: targetUser.id,
    userlogin: targetUser.userlogin,
    fullName: targetUser.fullName,
    role: targetUser.role || 'AUDITOR',
    positionName: targetUser.positionName || 'กรรมการผู้ตรวจประเมิน',
    impersonator: {
      id: adminToSave.id,
      userlogin: adminToSave.userlogin,
      fullName: adminToSave.fullName,
      role: 'ADMIN'
    }
  })

  // 5. บันทึกคุกกี้เซสชันใหม่
  setCookie(event, 'bru_user_session', JSON.stringify(impersonatedSession), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  return {
    ok: true,
    user: impersonatedSession,
    message: `สวมบทบาทเป็น "${targetUser.fullName}" เรียบร้อยแล้ว`
  }
})
