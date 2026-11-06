import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const body = await readBody(event)
  const { name, year, description, startDate, endDate } = body || {}

  if (!name || !year) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกชื่อรอบและปีงบประมาณ' })
  }

  const newId = `round-${year.trim()}-${Date.now().toString().slice(-4)}`
  const roundPayload = {
    id: newId,
    name: name.trim(),
    year: year.trim(),
    description: description ? description.trim() : null,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'OPEN'
  }

  try {
    const round = await prisma.evaluationRound.create({
      data: roundPayload
    })
    return { ok: true, data: round }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการสร้างรอบการประเมิน: ' + err.message
    })
  }
})
