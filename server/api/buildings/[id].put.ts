import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { code, name, floors, description, staffNames } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing building id' })
  }

  try {
    const existing = await prisma.building.findUnique({
      where: { id },
      include: { staffs: true }
    })

    if (!existing) {
      throw createError({ statusCode: 404, message: 'ไม่พบข้อมูลอาคารนี้ในระบบฐานข้อมูล' })
    }

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
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลอาคาร'
    })
  }
})
