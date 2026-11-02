import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { calculateEvaluation } from '~/shared/types/evaluation'

// In-memory store for instant zero-config testing if Postgres is not yet connected
const inMemoryAssessments: any[] = []

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
    scores,
    strengthsSummary,
    urgentProblems,
    correctivePlan,
    targetDeadline,
    signatureImage
  } = body

  if (!buildingName || !scores) {
    throw createError({ statusCode: 400, message: 'ข้อมูลแบบประเมินไม่ครบถ้วน' })
  }

  // 1. คำนวณคะแนนตามเกณฑ์แบบสอบถาม
  const evalResult = calculateEvaluation(scores)

  const assessmentData = {
    id: `eval-${Date.now()}`,
    roundId: roundId || 'round-2570',
    buildingId: buildingId || 'b-custom',
    buildingName,
    staffId: staffId || null,
    responsibleStaffText: responsibleStaffText || 'ไม่ระบุ',
    assessorId: assessorId || 'user-1',
    assessorName: assessorName || 'ผู้ตรวจประเมิน',
    assessedAt: new Date().toISOString(),
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
      // บันทึกลง Postgres ผ่าน Prisma
      const saved = await prisma.assessment.create({
        data: {
          buildingId: assessmentData.buildingId,
          staffId: assessmentData.staffId,
          assessorId: assessmentData.assessorId,
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
              score: s.score,
              isNA: s.isNA || false,
              defectNote: s.defectNote || null,
              photoUrl: s.photoUrl || null,
            }))
          }
        }
      })
      inMemoryAssessments.unshift(assessmentData)
      return { ok: true, data: saved }
    } catch (err: any) {}
  }

  // Fast Memory cache (0ms)
  inMemoryAssessments.unshift(assessmentData)
  return { ok: true, data: assessmentData, note: 'Saved to local memory cache' }
})

export { inMemoryAssessments }
