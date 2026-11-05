import { createHmac, timingSafeEqual } from 'node:crypto'

export interface SessionUser {
  id: string
  userlogin: string
  fullName: string
  role: string
  sig?: string
}

function getSecret(): string {
  try {
    if (typeof useRuntimeConfig === 'function') {
      const config = useRuntimeConfig()
      if (config?.jwtSecret) return String(config.jwtSecret)
    }
  } catch {}
  return process.env.JWT_SECRET || 'bru-facility-evaluation-secret-key-2026'
}

export function signSessionPayload(user: Omit<SessionUser, 'sig'>): string {
  const payload = `${user.id}|${user.userlogin}|${user.fullName}|${user.role}`
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createSignedSession(user: Omit<SessionUser, 'sig'>): SessionUser {
  return {
    id: user.id,
    userlogin: user.userlogin,
    fullName: user.fullName,
    role: user.role,
    sig: signSessionPayload(user)
  }
}

export function verifySignedSession(session: SessionUser | null | undefined): boolean {
  if (!session || !session.userlogin || !session.role || !session.sig) {
    return false
  }
  const expectedSig = signSessionPayload({
    id: session.id,
    userlogin: session.userlogin,
    fullName: session.fullName,
    role: session.role
  })
  try {
    const a = Buffer.from(session.sig, 'hex')
    const b = Buffer.from(expectedSig, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function getVerifiedSession(event: any): SessionUser | null {
  const raw = typeof getCookie === 'function' ? getCookie(event, 'bru_user_session') : null
  if (!raw) return null
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(decodeURIComponent(raw)) : raw
    if (verifySignedSession(parsed)) {
      return parsed
    }
  } catch {
    try {
      const parsed = JSON.parse(raw)
      if (verifySignedSession(parsed)) {
        return parsed
      }
    } catch {}
  }
  return null
}

export function requireAuth(event: any): SessionUser {
  const session = getVerifiedSession(event)
  if (!session) {
    if (typeof createError === 'function') {
      throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน (Unauthorized)' })
    }
    throw new Error('Unauthorized')
  }
  return session
}

export function requireAdmin(event: any): SessionUser {
  const session = requireAuth(event)
  if (session.role !== 'ADMIN') {
    if (typeof createError === 'function') {
      throw createError({ statusCode: 403, message: 'เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์ดำเนินการนี้ (Forbidden)' })
    }
    throw new Error('Forbidden')
  }
  return session
}
