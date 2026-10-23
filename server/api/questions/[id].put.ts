import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { dynamicQuestions } from './index.get'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = Number(idStr)
  const body = await readBody(event)
  const { title, categoryId, itemNumber } = body

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
    const question = dynamicQuestions.find(q => q.id === id)
    if (!question) {
      throw createError({ statusCode: 404, message: 'ไม่พบข้อคำถามนี้' })
    }
    if (title !== undefined && title.trim().length > 0) question.title = title.trim()
    if (categoryId !== undefined) question.categoryId = Number(categoryId)
    if (itemNumber !== undefined) question.itemNumber = Number(itemNumber)
    return { ok: true, message: 'อัปเดตข้อคำถามสำเร็จ', data: question }
  }
})
