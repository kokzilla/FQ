import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { evaluationRounds } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing round id' })
  }

  if (await isDbReady()) {
    try {
      await prisma.evaluationRound.delete({
        where: { id }
      })
      return { ok: true, message: 'ลบรอบการประเมินเรียบร้อยแล้ว' }
    } catch (err: any) {}
  }

  const idx = evaluationRounds.findIndex(r => r.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, message: 'ไม่พบรอบการประเมินนี้' })
  }
  evaluationRounds.splice(idx, 1)
  return { ok: true, message: 'ลบรอบการประเมินเรียบร้อยแล้ว' }
})
