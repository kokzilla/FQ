import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing building id' })
  }

  try {
    await prisma.building.delete({
      where: { id }
    })
    return { ok: true, message: 'ลบข้อมูลอาคารเรียบร้อยแล้ว' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูลอาคาร: ' + err.message
    })
  }
})
