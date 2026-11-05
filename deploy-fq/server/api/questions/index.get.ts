import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { EVALUATION_CATEGORIES, EVALUATION_QUESTIONS } from '../../../shared/constants/questions'

export const dynamicQuestions = [...EVALUATION_QUESTIONS]

export async function getDynamicQuestionsAndCategories() {
  if (await isDbReady()) {
    try {
      const [categories, questions] = await Promise.all([
        prisma.category.findMany({ orderBy: { order: 'asc' } }),
        prisma.questionItem.findMany({ orderBy: { id: 'asc' } })
      ])

      if (categories.length > 0 && questions.length > 0) {
        return { categories, questions }
      }
    } catch (err) {}
  }

  return {
    categories: EVALUATION_CATEGORIES,
    questions: dynamicQuestions
  }
}

export default defineEventHandler(async () => {
  const { categories, questions } = await getDynamicQuestionsAndCategories()
  return {
    ok: true,
    categories,
    questions
  }
})
