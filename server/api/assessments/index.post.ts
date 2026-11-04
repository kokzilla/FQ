import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { getColorCriteriaSettings } from '../../utils/settings'
import { calculateEvaluation } from '~/shared/types/evaluation'

// In-memory store for fallback if Postgres is not connected
export const inMemoryAssessments: any[] = []

export default defineEventHandler(async (event) => {
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

  const assessmentData = {
    id: `eval-${Date.now()}`,
    roundId: roundId || 'round-2570',
    buildingId: buildingId || 'b-custom',
    buildingName,
    staffId: staffId || null,
    responsibleStaffText: responsibleStaffText || 'ไม่ระบุ',
    assessorId: assessorId || 'user-1',
    assessorName: assessorName || 'ผู้ตรวจประเมิน',
    assessedAt: effectiveAssessedAt,
    totalScoreObtained: evalResult.totalScoreObtained,
    totalMaxScore: evalResult.totalMaxScore,
    percentage: evalResult.percentage,
    grade: evalResult.gradeKey,
    gradeLabel: evalResult.gradeLabel,
    gradeColor: evalResult.gradeColor,
    evaluatedItems: evalResult.evaluatedItems,
    naItems: evalResult.naItems,
    strengthsSummary: strengthsSummary || '',
    urgentProblems: urgentProblems || '',
    correctivePlan: correctivePlan || '',
    targetDeadline: targetDeadline || null,
    followUpResult: '',
    isFollowedUp: false,
    signatureImage: signatureImage || null,
    scores,
    createdAt: new Date().toISOString()
  }

  if (await isDbReady()) {
    try {
      // 1. ค้นหา / แมป buildingId ใน PostgreSQL
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
      }

      // 2. ค้นหา / แมป assessorId ใน PostgreSQL
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
      }

      // 3. บันทึกลง PostgreSQL พร้อม ScoreItem ทุกข้อ
      const saved = await prisma.assessment.create({
        data: {
          roundId: roundId || 'round-2570',
          buildingId: actualBuildingId,
          staffId: staffId || null,
          assessorId: actualAssessorId,
          responsibleStaffText: assessmentData.responsibleStaffText,
          totalScoreObtained: assessmentData.totalScoreObtained,
          totalMaxScore: assessmentData.totalMaxScore,
          percentage: assessmentData.percentage,
          grade: assessmentData.grade as any,
          strengthsSummary: assessmentData.strengthsSummary,
          urgentProblems: assessmentData.urgentProblems,
          correctivePlan: assessmentData.correctivePlan,
          targetDeadline: assessmentData.targetDeadline ? new Date(assessmentData.targetDeadline) : null,
          signatureImage: assessmentData.signatureImage,
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
          scores: true
        }
      })

      inMemoryAssessments.unshift(assessmentData)
      return { ok: true, data: saved, storage: 'postgresql' }
    } catch (err: any) {
      console.error('CRITICAL: Failed to save assessment to PostgreSQL:', err)
      // กรณีเกิดข้อผิดพลาด ให้โยน Error แจ้ง client หรือ fallback
    }
  }

  // Fast Memory cache fallback
  inMemoryAssessments.unshift(assessmentData)
  return { ok: true, data: assessmentData, storage: 'memory', note: 'Saved to local memory cache' }
})
