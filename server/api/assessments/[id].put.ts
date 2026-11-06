import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getColorCriteriaSettings } from '../../utils/settings'
import { calculateEvaluation } from '~/shared/types/evaluation'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing assessment id' })
  }

  const body = await readBody(event)
  const {
    scores,
    strengthsSummary,
    urgentProblems,
    correctivePlan,
    targetDeadline,
    signatureImage,
    assessedAt,
    responsibleStaffText,
    staffId
  } = body || {}

  if (!scores) {
    throw createError({ statusCode: 400, message: 'ข้อมูลแบบประเมินไม่ครบถ้วน (ไม่พบคะแนน)' })
  }

  try {
    const existing = await prisma.assessment.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({ statusCode: 404, message: 'ไม่พบข้อมูลผลการประเมินนี้ในระบบ' })
    }

    // คำนวณคะแนนตามเกณฑ์
    const colorCriteria = await getColorCriteriaSettings()
    const evalResult = calculateEvaluation(scores, colorCriteria.building)
    const effectiveAssessedAt = assessedAt ? new Date(assessedAt) : existing.assessedAt

    // ใช้ Transaction ในการลบ ScoreItem เดิมและสร้างใหม่ พร้อมอัปเดต Assessment
    const updated = await prisma.$transaction(async (tx) => {
      // 1. ลบคะแนนเดิม
      await tx.scoreItem.deleteMany({
        where: { assessmentId: id }
      })

      // 2. สร้างคะแนนใหม่
      const scoreData = Object.entries(scores).map(([qId, s]: [string, any]) => ({
        assessmentId: id,
        questionItemId: parseInt(qId),
        score: s.score !== null && s.score !== undefined ? Number(s.score) : null,
        isNA: Boolean(s.isNA),
        defectNote: s.defectNote || null,
        photoUrl: s.photoUrl || null,
      }))

      if (scoreData.length > 0) {
        await tx.scoreItem.createMany({
          data: scoreData
        })
      }

      // 3. อัปเดตข้อมูล Assessment
      return tx.assessment.update({
        where: { id },
        data: {
          totalScoreObtained: evalResult.totalScoreObtained,
          totalMaxScore: evalResult.totalMaxScore,
          percentage: evalResult.percentage,
          grade: evalResult.gradeKey as any,
          strengthsSummary: strengthsSummary !== undefined ? strengthsSummary : existing.strengthsSummary,
          urgentProblems: urgentProblems !== undefined ? urgentProblems : existing.urgentProblems,
          correctivePlan: correctivePlan !== undefined ? correctivePlan : existing.correctivePlan,
          targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
          signatureImage: signatureImage !== undefined ? signatureImage : existing.signatureImage,
          assessedAt: effectiveAssessedAt,
          staffId: staffId !== undefined ? staffId : existing.staffId,
          responsibleStaffText: responsibleStaffText !== undefined ? responsibleStaffText : existing.responsibleStaffText
        },
        include: {
          scores: true,
          building: true,
          assessor: true
        }
      })
    })

    return { ok: true, data: updated, storage: 'postgresql' }
  } catch (err: any) {
    console.error('Failed to update assessment:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      message: 'เกิดข้อผิดพลาดในการแก้ไขผลการประเมิน: ' + (err.message || err)
    })
  }
})
