import { defineEventHandler, getQuery, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const query = getQuery(event)
  const { roundId, buildingId, assessorId, staffId } = query

  const where: any = {}

  if (roundId) {
    where.roundId = String(roundId)
  }

  if (buildingId) {
    where.buildingId = String(buildingId)
  }

  if (staffId) {
    where.staffId = String(staffId)
  }

  if (assessorId) {
    const assessorUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: String(assessorId) },
          { userlogin: String(assessorId) }
        ]
      }
    })
    if (assessorUser) {
      where.assessorId = assessorUser.id
    } else {
      where.assessorId = String(assessorId)
    }
  }

  try {
    const list = await prisma.assessment.findMany({
      where,
      include: {
        building: true,
        assessor: true,
        scores: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { ok: true, data: list }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลการประเมินจากฐานข้อมูล: ' + err.message
    })
  }
})
