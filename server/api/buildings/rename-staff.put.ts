import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { replaceStaffNameInText } from '../../utils/nameSync'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const body = await readBody(event)
  const oldName = typeof body?.oldName === 'string' ? body.oldName.trim() : ''
  const newName = typeof body?.newName === 'string' ? body.newName.trim() : ''
  const buildingId = typeof body?.buildingId === 'string' && body.buildingId.trim() ? body.buildingId.trim() : undefined
  const syncAll = body?.syncAll !== false // Default true: update across all buildings, assessments & matching User

  if (!oldName || !newName) {
    throw createError({
      statusCode: 400,
      message: 'กรุณาระบุชื่อเดิมและชื่อใหม่ให้ครบถ้วน'
    })
  }

  if (oldName === newName) {
    return {
      ok: true,
      updatedStaffCount: 0,
      updatedAssessmentCount: 0,
      updatedUserCount: 0
    }
  }

  try {
    // 1. Update BuildingStaff (either all matching records or scoped to specific building)
    const staffWhere = syncAll || !buildingId
      ? { staffName: oldName }
      : { buildingId, staffName: oldName }

    const staffRes = await prisma.buildingStaff.updateMany({
      where: staffWhere,
      data: { staffName: newName }
    })

    let updatedAssessmentCount = 0
    let updatedUserCount = 0

    // 2. Sync Assessment.responsibleStaffText & User.fullName
    const assessmentWhere: any = {
      responsibleStaffText: { contains: oldName }
    }
    if (!syncAll && buildingId) {
      assessmentWhere.buildingId = buildingId
    }

    const matchingAssessments = await prisma.assessment.findMany({
      where: assessmentWhere,
      select: { id: true, responsibleStaffText: true }
    })

    for (const a of matchingAssessments) {
      const { updated: nextText, changed } = replaceStaffNameInText(
        a.responsibleStaffText,
        oldName,
        newName
      )
      if (changed) {
        await prisma.assessment.update({
          where: { id: a.id },
          data: { responsibleStaffText: nextText }
        })
        updatedAssessmentCount++
      }
    }

    if (syncAll) {
      const userRes = await prisma.user.updateMany({
        where: { fullName: oldName },
        data: { fullName: newName }
      })
      updatedUserCount = userRes.count
    }

    return {
      ok: true,
      updatedStaffCount: staffRes.count,
      updatedAssessmentCount,
      updatedUserCount
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการแก้ไขชื่อผู้รับผิดชอบ: ' + err.message
    })
  }
})
