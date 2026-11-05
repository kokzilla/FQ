import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code, name, floors, description, staffNames } = body

  if (!code || !name) {
    throw createError({ statusCode: 400, message: 'กรุณาระบุรหัสอาคารและชื่ออาคาร' })
  }

  if (await isDbReady()) {
    try {
      const building = await prisma.building.create({
        data: {
          code: code.trim(),
          name: name.trim(),
          floors: floors ? parseInt(floors) : 1,
          description: description || null,
          staffs: {
            create: (staffNames || []).filter((s: string) => s.trim().length > 0).map((s: string) => ({
              staffName: s.trim()
            }))
          }
        },
        include: { staffs: true }
      })
      return { ok: true, data: building }
    } catch (err: any) {}
  }

  // Fast Fallback store (0ms)
  const newBuilding = {
    id: `b-${Date.now()}`,
    code: code.trim(),
    name: name.trim(),
    floors: floors ? parseInt(floors) : 1,
    description: description || null,
    staffs: (staffNames || []).map((s: string, idx: number) => ({
      id: `s-${Date.now()}-${idx}`,
      staffName: s.trim()
    }))
  }

  if (!(globalThis as any).__DEFAULT_BUILDINGS) {
    (globalThis as any).__DEFAULT_BUILDINGS = []
  }
  (globalThis as any).__DEFAULT_BUILDINGS.push(newBuilding)

  return { ok: true, data: newBuilding }
})
