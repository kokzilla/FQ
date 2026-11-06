import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async () => {
  await requireDatabase()

  try {
    const buildings = await prisma.building.findMany({
      where: { isActive: true },
      include: {
        staffs: {
          include: { user: true }
        }
      },
      orderBy: { code: 'asc' }
    })

    return { ok: true, data: buildings }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลอาคารจากฐานข้อมูล: ' + err.message
    })
  }
})
