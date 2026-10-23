import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { EVALUATION_CATEGORIES, EVALUATION_QUESTIONS } from '../../../shared/constants/questions'

export const dynamicQuestions = [...EVALUATION_QUESTIONS]

export default defineEventHandler(async () => {
  try {
    const [categories, questions] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: 'asc' } }),
      prisma.questionItem.findMany({ orderBy: { id: 'asc' } })
    ])

    if (categories.length > 0 && questions.length > 0) {
      return {
        ok: true,
        categories,
        questions
      }
    }
  } catch (err) {}

  return {
    ok: true,
    categories: EVALUATION_CATEGORIES,
    questions: dynamicQuestions
  }
})
