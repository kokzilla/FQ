import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getBuildingAuditorsMap } from '../../utils/settings'

export default defineEventHandler(async () => {
  await requireDatabase()

  try {
    const [buildings, auditorsMap] = await Promise.all([
      prisma.building.findMany({
        where: { isActive: true },
        include: {
          staffs: {
            include: { user: true }
          }
        },
        orderBy: { code: 'asc' }
      }),
      getBuildingAuditorsMap()
    ])

    const enriched = buildings.map(b => ({
      ...b,
      auditors: auditorsMap[b.id] || []
    }))

    return { ok: true, data: enriched }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลอาคารจากฐานข้อมูล: ' + err.message
    })
  }
})
