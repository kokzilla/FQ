import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { localUsers } from './index.get'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userlogin, fullName, email, positionName, departmentId, role } = body

  if (!userlogin || !fullName || !role) {
    throw createError({ statusCode: 400, message: 'ข้อมูลบุคลากรไม่ครบถ้วน' })
  }

  if (await isDbReady()) {
    try {
      const user = await prisma.user.upsert({
        where: { userlogin },
        update: { role, fullName, positionName, email },
        create: { userlogin, fullName, role, positionName, email, departmentId }
      })
      return { ok: true, data: user }
    } catch (err) {}
  }

  // Fast Local fallback (0ms)
  const existing = localUsers.find(u => u.userlogin === userlogin)
  if (existing) {
    existing.role = role
    existing.fullName = fullName
    existing.positionName = positionName
    return { ok: true, data: existing }
  } else {
    const newUser = {
      id: `u-${Date.now()}`,
      userlogin,
      fullName,
      role,
      positionName,
      email
    }
    localUsers.unshift(newUser)
    return { ok: true, data: newUser }
  }
})
