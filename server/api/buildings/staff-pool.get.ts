import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export default defineEventHandler(async () => {
  const staffPool: { staffName: string; source: 'DB' | 'DEFAULT' }[] = []

  if (await isDbReady()) {
    try {
      const dbStaffs = await prisma.buildingStaff.findMany({
        select: { staffName: true },
        distinct: ['staffName']
      })
      for (const s of dbStaffs) {
        if (s.staffName && s.staffName.trim()) {
          staffPool.push({ staffName: s.staffName.trim(), source: 'DB' })
        }
      }
      if (staffPool.length > 0) {
        return { ok: true, data: staffPool }
      }
    } catch (err) {}
  }

  // Fast fallback to in-memory buildings (0ms)
  const defaultBuildings: any = (globalThis as any).__DEFAULT_BUILDINGS || []
  const seen = new Set<string>()
  for (const b of defaultBuildings) {
    for (const s of (b.staffs || [])) {
      const name = (s.staffName || '').trim()
      if (name && !seen.has(name)) {
        seen.add(name)
        staffPool.push({ staffName: name, source: 'DEFAULT' })
      }
    }
  }

  return {
    ok: true,
    data: staffPool
  }
})
