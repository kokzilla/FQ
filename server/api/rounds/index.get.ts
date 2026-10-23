import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'

export const evaluationRounds = [
  {
    id: 'round-2568',
    name: 'รอบการประเมินประจำปีงบประมาณ 2568',
    year: '2568',
    description: 'รอบประเมินมาตรฐานความสะอาดประจำปี 2568 ทั่วมหาวิทยาลัย',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    status: 'CLOSED',
    createdAt: new Date('2025-10-01').toISOString()
  },
  {
    id: 'round-2570',
    name: 'รอบการประเมินประจำปีงบประมาณ 2570',
    year: '2570',
    description: 'รอบประเมินปัจจุบัน มหาวิทยาลัยราชภัฏบุรีรัมย์',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    status: 'OPEN',
    createdAt: new Date('2026-10-01').toISOString()
  }
]

export default defineEventHandler(async () => {
  try {
    const list = await prisma.evaluationRound.findMany({
      orderBy: { year: 'desc' }
    })
    if (list.length > 0) {
      return { ok: true, data: list }
    }
  } catch (err) {}

  return {
    ok: true,
    data: evaluationRounds.sort((a, b) => (a.year < b.year ? 1 : -1))
  }
})
