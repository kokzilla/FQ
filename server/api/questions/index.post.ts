import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { dynamicQuestions } from './index.get'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { categoryId, title } = body

  if (!categoryId || !title) {
    throw createError({ statusCode: 400, message: 'กรุณาระบุหมวดและข้อความคำถาม' })
  }

  const catId = Number(categoryId)
  const cleanTitle = title.trim()

  try {
    const existingQuestions = await prisma.questionItem.findMany({
      where: { categoryId: catId }
    })
    const maxItemNumber = existingQuestions.length > 0
      ? Math.max(...existingQuestions.map(q => q.itemNumber))
      : 0

    const allQuestions = await prisma.questionItem.findMany({ select: { id: true } })
    const newId = allQuestions.length > 0 ? Math.max(...allQuestions.map(q => q.id)) + 1 : 1

    const newQuestion = await prisma.questionItem.create({
      data: {
        id: newId,
        categoryId: catId,
        itemNumber: maxItemNumber + 1,
        title: cleanTitle,
        maxScore: 5
      }
    })

    return { ok: true, data: newQuestion }
  } catch (err: any) {
    // Fallback in-memory
    const catQuestions = dynamicQuestions.filter(q => q.categoryId === catId)
    const maxItemNumber = catQuestions.length > 0 ? Math.max(...catQuestions.map(q => q.itemNumber)) : 0
    const newId = dynamicQuestions.length > 0 ? Math.max(...dynamicQuestions.map(q => q.id)) + 1 : 1

    const newQuestion = {
      id: newId,
      categoryId: catId,
      itemNumber: maxItemNumber + 1,
      title: cleanTitle,
      maxScore: 5
    }
    dynamicQuestions.push(newQuestion)
    return { ok: true, data: newQuestion }
  }
})
