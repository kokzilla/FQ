import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async () => {
  await requireDatabase()

  try {
    const list = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { ok: true, data: list }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน: ' + err.message
    })
  }
})
