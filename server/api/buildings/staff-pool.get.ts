import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async () => {
  await requireDatabase()

  try {
    const dbStaffs = await prisma.buildingStaff.findMany({
      select: { staffName: true },
      distinct: ['staffName']
    })
    const staffPool: { staffName: string; source: 'DB' }[] = []
    for (const s of dbStaffs) {
      if (s.staffName && s.staffName.trim()) {
        staffPool.push({ staffName: s.staffName.trim(), source: 'DB' })
      }
    }
    return { ok: true, data: staffPool }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงรายชื่อบุคลากรประจำอาคาร: ' + err.message
    })
  }
})
