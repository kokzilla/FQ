import { defineEventHandler, createError, getCookie, setCookie, deleteCookie } from 'h3'
import { createSignedSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const adminCookieRaw = getCookie(event, 'bru_admin_session')
  const userSessionRaw = getCookie(event, 'bru_user_session')

  let originalAdmin: any = null
  if (adminCookieRaw) {
    try {
      originalAdmin = JSON.parse(decodeURIComponent(adminCookieRaw))
    } catch {
      try { originalAdmin = JSON.parse(adminCookieRaw) } catch {}
    }
  }

  if (!originalAdmin && userSessionRaw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userSessionRaw))
      if (parsed.impersonator) {
        originalAdmin = parsed.impersonator
      }
    } catch {
      try {
        const parsed = JSON.parse(userSessionRaw)
        if (parsed.impersonator) {
          originalAdmin = parsed.impersonator
        }
      } catch {}
    }
  }

  if (!originalAdmin || !originalAdmin.userlogin) {
    throw createError({ statusCode: 400, message: 'ไม่พบข้อมูลเซสชันผู้ดูแลระบบเดิม' })
  }

  // สร้างเซสชัน Admin ที่ลงนามถูกต้อง
  const restoredSession = createSignedSession({
    id: originalAdmin.id || 'admin',
    userlogin: originalAdmin.userlogin || 'admin',
    fullName: originalAdmin.fullName || 'ผู้ดูแลระบบ',
    role: 'ADMIN',
    positionName: originalAdmin.positionName || 'ผู้ดูแลระบบ'
  })

  // คืนค่าเซสชันหลักให้เป็น Admin
  setCookie(event, 'bru_user_session', JSON.stringify(restoredSession), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  // ลบคุกกี้สำรอง admin
  deleteCookie(event, 'bru_admin_session', { path: '/' })

  return {
    ok: true,
    user: restoredSession,
    message: 'กลับสู่บทบาทผู้ดูแลระบบ (Admin) เรียบร้อยแล้ว'
  }
})
