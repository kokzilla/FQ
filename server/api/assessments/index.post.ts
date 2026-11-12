import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getColorCriteriaSettings } from '../../utils/settings'
import { calculateEvaluation } from '~/shared/types/evaluation'

export default defineEventHandler(async (event) => {
  // บังคับว่าต้องมีฐานข้อมูลเท่านั้น
  await requireDatabase()

  const body = await readBody(event)
  const {
    roundId,
    buildingId,
    buildingName,
    staffId,
    responsibleStaffText,
    assessorId,
    assessorName,
    assessedAt,
    scores,
    strengthsSummary,
    urgentProblems,
    correctivePlan,
    targetDeadline,
    signatureImage
  } = body || {}

  if (!buildingName || !scores) {
    throw createError({ statusCode: 400, message: 'ข้อมูลแบบประเมินไม่ครบถ้วน' })
  }

  // 1. คำนวณคะแนนตามเกณฑ์แบบสอบถามและเกณฑ์สีปัจจุบัน
  const colorCriteria = await getColorCriteriaSettings()
  const evalResult = calculateEvaluation(scores, colorCriteria.building)
  const effectiveAssessedAt = assessedAt ? new Date(assessedAt).toISOString() : new Date().toISOString()

  // 2. ค้นหา / แมป buildingId ใน PostgreSQL
  let actualBuildingId = buildingId
  let building = null
  if (actualBuildingId) {
    building = await prisma.building.findFirst({
      where: {
        OR: [
          { id: actualBuildingId },
          { code: actualBuildingId }
        ]
      }
    })
  }
  if (!building && buildingName) {
    building = await prisma.building.findFirst({
      where: { name: buildingName }
    })
  }
  if (!building) {
    building = await prisma.building.findFirst()
  }
  if (building) {
    actualBuildingId = building.id
  } else {
    throw createError({ statusCode: 400, message: 'ไม่พบข้อมูลอาคารที่เลือกในระบบฐานข้อมูล' })
  }

  // 3. ค้นหา / แมป assessorId ใน PostgreSQL
  let actualAssessorId = assessorId
  let assessorUser = null
  if (actualAssessorId) {
    assessorUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: actualAssessorId },
          { userlogin: actualAssessorId }
        ]
      }
    })
  }
  if (!assessorUser && assessorName) {
    assessorUser = await prisma.user.findFirst({
      where: { fullName: assessorName }
    })
  }
  if (!assessorUser) {
    assessorUser = await prisma.user.findFirst({
      where: {
        OR: [{ role: 'AUDITOR' }, { role: 'ADMIN' }]
      }
    })
  }
  if (assessorUser) {
    actualAssessorId = assessorUser.id
  } else {
    throw createError({ statusCode: 400, message: 'ไม่พบบัญชีผู้ตรวจประเมินในฐานข้อมูล' })
  }

  // 3.5 ตรวจสอบโควตาผู้ประเมินไม่เกิน 5 คนต่อผู้ปฏิบัติงาน 1 คนในรอบและอาคารเดียวกัน
  const targetRoundId = roundId || 'round-2570'
  const cleanStaffName = (name?: string | null) => {
    if (!name) return ''
    let str = String(name).trim()
    const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)\s*/i
    let prev = ''
    while (prev !== str) {
      prev = str
      str = str.replace(prefixRegex, '').trim()
    }
    return str.toLowerCase()
  }

  const existingInBuilding = await prisma.assessment.findMany({
    where: {
      roundId: targetRoundId,
      buildingId: actualBuildingId
    },
    select: {
      id: true,
      assessorId: true,
      staffId: true,
      responsibleStaffText: true
    }
  })

  const targetCleanedName = cleanStaffName(responsibleStaffText)
  const matchingStaffAssessments = existingInBuilding.filter((a) => {
    if (staffId && a.staffId && a.staffId === staffId) return true
    if (targetCleanedName && cleanStaffName(a.responsibleStaffText) === targetCleanedName) return true
    return false
  })

  const uniqueAssessorIds = new Set(matchingStaffAssessments.map(a => a.assessorId))
  if (uniqueAssessorIds.size >= 5 && !uniqueAssessorIds.has(actualAssessorId)) {
    throw createError({
      statusCode: 400,
      message: 'ผู้ปฏิบัติงานท่านนี้ได้รับการประเมินครบ 5 คนแล้วในรอบนี้ ไม่สามารถประเมินเพิ่มได้'
    })
  }

  // 4. บันทึกลง PostgreSQL พร้อม ScoreItem ทุกข้อ
  try {
    const saved = await prisma.assessment.create({
      data: {
        roundId: roundId || 'round-2570',
        buildingId: actualBuildingId,
        staffId: staffId || null,
        assessorId: actualAssessorId,
        responsibleStaffText: responsibleStaffText || 'ไม่ระบุ',
        assessedAt: new Date(effectiveAssessedAt),
        totalScoreObtained: evalResult.totalScoreObtained,
        totalMaxScore: evalResult.totalMaxScore,
        percentage: evalResult.percentage,
        grade: evalResult.gradeKey as any,
        strengthsSummary: strengthsSummary || '',
        urgentProblems: urgentProblems || '',
        correctivePlan: correctivePlan || '',
        targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
        signatureImage: signatureImage || null,
        scores: {
          create: Object.entries(scores).map(([qId, s]: [string, any]) => ({
            questionItemId: parseInt(qId),
            score: s.score !== null && s.score !== undefined ? Number(s.score) : null,
            isNA: Boolean(s.isNA),
            defectNote: s.defectNote || null,
            photoUrl: s.photoUrl || null,
          }))
        }
      },
      include: {
        scores: true,
        building: true,
        assessor: true
      }
    })

    return { ok: true, data: saved, storage: 'postgresql' }
  } catch (err: any) {
    console.error('CRITICAL: Failed to save assessment to PostgreSQL:', err)
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการบันทึกผลการประเมินลงฐานข้อมูล PostgreSQL: ' + err.message
    })
  }
})
