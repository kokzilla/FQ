import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { inMemoryAssessments } from './index.post'

export default defineEventHandler(async () => {
  if (await isDbReady()) {
    try {
      const list = await prisma.assessment.findMany({
        include: {
          building: true,
          assessor: true,
          scores: true
        },
        orderBy: { createdAt: 'desc' }
      })
      return { ok: true, data: list }
    } catch (err) {}
  }

  return { ok: true, data: inMemoryAssessments }
})
