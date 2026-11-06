import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export async function getDynamicQuestionsAndCategories() {
  await requireDatabase()
  const [categories, questions] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.questionItem.findMany({ orderBy: { id: 'asc' } })
  ])

  return { categories, questions }
}

export default defineEventHandler(async () => {
  try {
    const { categories, questions } = await getDynamicQuestionsAndCategories()
    return {
      ok: true,
      categories,
      questions
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อคำถาม: ' + err.message
    })
  }
})
