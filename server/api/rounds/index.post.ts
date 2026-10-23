import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, year, description, startDate, endDate } = body

  if (!name || !year) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกชื่อรอบและปีงบประมาณ' })
  }

  const newId = `round-${year}-${Date.now().toString().slice(-4)}`

  try {
    const round = await prisma.evaluationRound.create({
      data: {
        id: newId,
        name: name.trim(),
        year: year.trim(),
        description: description ? description.trim() : null,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
        status: 'OPEN'
      }
    })
    return { ok: true, data: round }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err?.message || 'ไม่สามารถสร้างรอบประเมินได้' })
  }
})
