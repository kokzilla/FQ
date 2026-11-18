import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async () => {
  await requireDatabase()

  try {
    const [dbStaffs, housekeeperUsers] = await Promise.all([
      prisma.buildingStaff.findMany({
        select: { staffName: true, userId: true },
        orderBy: { userId: 'desc' }
      }),
      prisma.user.findMany({
        where: { role: 'HOUSEKEEPER' },
        select: { id: true, userlogin: true, fullName: true }
      })
    ])

    const seenNames = new Set<string>()
    const staffPool: { staffName: string; userId: string | null; source: 'DB' | 'USER' }[] = []

    for (const s of dbStaffs) {
      const name = s.staffName?.trim()
      if (name && !seenNames.has(name)) {
        seenNames.add(name)
        staffPool.push({ staffName: name, userId: s.userId ?? null, source: 'DB' })
      }
    }

    for (const u of housekeeperUsers) {
      const name = u.fullName?.trim()
      if (name && !seenNames.has(name)) {
        seenNames.add(name)
        staffPool.push({ staffName: name, userId: u.id, source: 'USER' })
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
