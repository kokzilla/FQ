import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { inMemoryAssessments } from './index.post'
import { ensureMockAssessments } from '../reports/summary.get'

export default defineEventHandler(async () => {
  ensureMockAssessments()

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
      if (list.length > 0) {
        return { ok: true, data: list }
      }
    } catch (err) {}
  }

  return { ok: true, data: inMemoryAssessments }
})
