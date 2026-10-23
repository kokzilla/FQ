import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing round id' })
  }

  try {
    await prisma.evaluationRound.delete({
      where: { id }
    })
    return { ok: true, message: 'ลบรอบการประเมินเรียบร้อยแล้ว' }
  } catch (err: any) {
    throw createError({ statusCode: 404, message: 'ไม่พบรอบการประเมินนี้' })
  }
})
