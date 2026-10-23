import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { localUsers } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { role, fullName, positionName } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing user id' })
  }

  if (await isDbReady()) {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(role && { role }),
          ...(fullName && { fullName }),
          ...(positionName && { positionName })
        }
      })
      return { ok: true, data: updated }
    } catch (err: any) {}
  }

  // Fast Local fallback (0ms)
  const target = localUsers.find(u => u.id === id || u.userlogin === id)
  if (target) {
    if (role) target.role = role
    if (fullName) target.fullName = fullName
    if (positionName) target.positionName = positionName
    return { ok: true, data: target }
  }
  throw createError({ statusCode: 404, message: 'ไม่พบบุคลากรนี้ในระบบ' })
})
