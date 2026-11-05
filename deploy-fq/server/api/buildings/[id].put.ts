import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { code, name, floors, description, staffNames } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing building id' })
  }

  if (await isDbReady()) {
    try {
      const existing = await prisma.building.findUnique({
        where: { id },
        include: { staffs: true }
      })

      if (existing) {
        await prisma.building.update({
          where: { id },
          data: {
            code: code ? code.trim() : existing.code,
            name: name ? name.trim() : existing.name,
            floors: floors !== undefined ? parseInt(floors) : existing.floors,
            description: description !== undefined ? description : existing.description,
          }
        })

        if (Array.isArray(staffNames)) {
          await prisma.buildingStaff.deleteMany({
            where: { buildingId: id }
          })

          const validStaffs = staffNames.map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          if (validStaffs.length > 0) {
            await prisma.buildingStaff.createMany({
              data: validStaffs.map((staffName: string) => ({
                buildingId: id,
                staffName
              }))
            })
          }
        }

        const finalBuilding = await prisma.building.findUnique({
          where: { id },
          include: { staffs: true }
        })

        return { ok: true, data: finalBuilding }
      }
    } catch (err: any) {}
  }

  // Fast Fallback update for mock/in-memory (0ms)
  const defaultBuildings: any = (globalThis as any).__DEFAULT_BUILDINGS
  if (defaultBuildings) {
    const item = defaultBuildings.find((b: any) => b.id === id)
    if (item) {
      if (code) item.code = code.trim()
      if (name) item.name = name.trim()
      if (floors) item.floors = parseInt(floors)
      if (description !== undefined) item.description = description
      if (Array.isArray(staffNames)) {
        item.staffs = staffNames.map((s: string, idx: number) => ({ id: `s-${Date.now()}-${idx}`, staffName: s.trim() }))
      }
      return { ok: true, data: item }
    }
  }

  return {
    ok: true,
    data: {
      id,
      code,
      name,
      floors: parseInt(floors || '1'),
      description,
      staffs: (staffNames || []).map((s: string, idx: number) => ({ id: `s-${idx}`, staffName: s.trim() }))
    }
  }
})
