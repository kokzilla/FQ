import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing user id' })
  }

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
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการยกเลิกสิทธิ์บุคลากร: ' + err.message
    })
  }
})
