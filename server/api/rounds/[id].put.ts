import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status, name, year, description, startDate, endDate } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing round id' })
  }

  try {
    const updated = await prisma.evaluationRound.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(year && { year }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      }
    })
    return { ok: true, data: updated }
  } catch (err: any) {
    throw createError({ statusCode: 404, message: 'ไม่พบรอบการประเมินนี้' })
  }
})
