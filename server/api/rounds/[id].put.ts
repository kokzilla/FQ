import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { evaluationRounds } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status, name, year, description, startDate, endDate } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing round id' })
  }

  if (await isDbReady()) {
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
    } catch (err: any) {}
  }

  const target = evaluationRounds.find(r => r.id === id)
  if (!target) {
    throw createError({ statusCode: 404, message: 'ไม่พบรอบการประเมินนี้' })
  }
  if (status) target.status = status
  if (name) target.name = name
  if (year) target.year = year
  if (description !== undefined) target.description = description
  if (startDate) target.startDate = startDate
  if (endDate) target.endDate = endDate

  return { ok: true, data: target }
})
