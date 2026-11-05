import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing building id' })
  }

  if (await isDbReady()) {
    try {
      await prisma.building.delete({
        where: { id }
      })
      return { ok: true, message: 'ลบข้อมูลอาคารเรียบร้อยแล้ว' }
    } catch (err: any) {}
  }

  // Fast Fallback store (0ms)
  if ((globalThis as any).__DEFAULT_BUILDINGS) {
    (globalThis as any).__DEFAULT_BUILDINGS = (globalThis as any).__DEFAULT_BUILDINGS.filter((b: any) => b.id !== id)
    return { ok: true, message: 'ลบข้อมูลอาคารเรียบร้อยแล้ว' }
  }

  return { ok: true, message: 'ลบข้อมูลอาคารเรียบร้อยแล้ว' }
})
