import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { dynamicQuestions } from './index.get'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = Number(idStr)

  try {
    await prisma.questionItem.delete({
      where: { id }
    })
    return { ok: true, message: 'ลบข้อคำถามเรียบร้อยแล้ว' }
  } catch (err: any) {
    const index = dynamicQuestions.findIndex(q => q.id === id)
    if (index === -1) {
      throw createError({ statusCode: 404, message: 'ไม่พบข้อคำถามนี้' })
    }
    dynamicQuestions.splice(index, 1)
    return { ok: true, message: 'ลบข้อคำถามเรียบร้อยแล้ว' }
  }
})
