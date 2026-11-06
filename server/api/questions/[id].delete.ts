import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const idStr = getRouterParam(event, 'id')
  const id = Number(idStr)

  try {
    await prisma.questionItem.delete({
      where: { id }
    })
    return { ok: true, message: 'ลบข้อคำถามเรียบร้อยแล้ว' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการลบข้อคำถาม: ' + err.message
    })
  }
})
