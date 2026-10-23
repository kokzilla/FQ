import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { localUsers } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing user id' })
  }

  if (await isDbReady()) {
    try {
      await prisma.user.deleteMany({
        where: {
          OR: [
            { id },
            { userlogin: id }
          ]
        }
      })
      return { ok: true, message: 'ยกเลิกสิทธิ์บุคลากรเรียบร้อยแล้ว' }
    } catch (err: any) {}
  }

  // Fast Local fallback (0ms)
  const idx = localUsers.findIndex(u => u.id === id || u.userlogin === id)
  if (idx !== -1) {
    localUsers.splice(idx, 1)
    return { ok: true, message: 'ยกเลิกสิทธิ์บุคลากรเรียบร้อยแล้ว' }
  }
  throw createError({ statusCode: 404, message: 'ไม่พบบุคลากรนี้ในระบบ' })
})
