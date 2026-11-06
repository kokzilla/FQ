import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export async function getAllEvaluationRounds() {
  await requireDatabase()
  return await prisma.evaluationRound.findMany({
    orderBy: { year: 'desc' }
  })
}

export default defineEventHandler(async () => {
  try {
    const data = await getAllEvaluationRounds()
    return {
      ok: true,
      data
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: 'เกิดข้อผิดพลาดในการดึงรอบการประเมิน: ' + err.message
    })
  }
})
