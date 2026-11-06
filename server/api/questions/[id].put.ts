import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const idStr = getRouterParam(event, 'id')
  const id = Number(idStr)
  const body = await readBody(event)
  const { title, categoryId, itemNumber } = body || {}

  try {
    const updated = await prisma.questionItem.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
        ...(itemNumber !== undefined && { itemNumber: Number(itemNumber) })
      }
    })
    return { ok: true, message: 'อัปเดตข้อคำถามสำเร็จ', data: updated }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อคำถาม: ' + err.message
    })
  }
})
