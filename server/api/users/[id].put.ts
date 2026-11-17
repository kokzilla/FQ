import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getBuildingAuditorsMap } from '../../utils/settings'
import { replaceStaffNameInText, syncAuditorInMap } from '../../utils/nameSync'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { role, fullName, positionName, email, userlogin } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing user id' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' })
  }

  const nextFullName = typeof fullName === 'string' ? fullName.trim() : existing.fullName
  const nextUserlogin = typeof userlogin === 'string' ? userlogin.trim() : existing.userlogin
  const nextPositionName = positionName !== undefined ? (typeof positionName === 'string' ? positionName.trim() : positionName) : existing.positionName
  const nextEmail = email !== undefined ? (typeof email === 'string' ? email.trim() : email) : existing.email
  const nextRole = typeof role === 'string' && role.trim() ? role.trim() : existing.role

  if (!nextFullName) {
    throw createError({ statusCode: 400, message: 'กรุณาระบุชื่อ-นามสกุล' })
  }
  if (!nextUserlogin) {
    throw createError({ statusCode: 400, message: 'กรุณาระบุ Username (userlogin)' })
  }

  // Prevent duplicate userlogin when changing username
  if (nextUserlogin !== existing.userlogin) {
    const duplicate = await prisma.user.findUnique({ where: { userlogin: nextUserlogin } })
    if (duplicate && duplicate.id !== id) {
      throw createError({
        statusCode: 409,
        message: `Username "${nextUserlogin}" มีผู้ใช้งานอื่นใช้แล้วในระบบ`
      })
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: nextRole,
        fullName: nextFullName,
        userlogin: nextUserlogin,
        positionName: nextPositionName,
        email: nextEmail
      }
    })

    const nameChanged = nextFullName !== existing.fullName
    const loginChanged = nextUserlogin !== existing.userlogin

    if (nameChanged || loginChanged) {
      // 1. Sync assigned building auditors in SystemSetting
      const currentMap = await getBuildingAuditorsMap()
      const { updatedMap, changed: mapChanged } = syncAuditorInMap(
        currentMap,
        {
          userId: id,
          oldUserlogin: existing.userlogin,
          oldFullName: existing.fullName
        },
        {
          userlogin: nextUserlogin,
          fullName: nextFullName
        }
      )

      if (mapChanged) {
        await (prisma as any).systemSetting.upsert({
          where: { key: 'building_auditors' },
          update: { value: JSON.stringify(updatedMap) },
          create: { key: 'building_auditors', value: JSON.stringify(updatedMap) }
        })
      }

      // 2. Sync BuildingStaff and Assessment.responsibleStaffText when fullName changes
      if (nameChanged) {
        await prisma.buildingStaff.updateMany({
          where: {
            OR: [
              { userId: id },
              { staffName: existing.fullName }
            ]
          },
          data: { staffName: nextFullName }
        })

        const matchingAssessments = await prisma.assessment.findMany({
          where: {
            responsibleStaffText: { contains: existing.fullName }
          },
          select: { id: true, responsibleStaffText: true }
        })

        for (const a of matchingAssessments) {
          const { updated: nextText, changed } = replaceStaffNameInText(
            a.responsibleStaffText,
            existing.fullName,
            nextFullName
          )
          if (changed) {
            await prisma.assessment.update({
              where: { id: a.id },
              data: { responsibleStaffText: nextText }
            })
          }
        }
      }
    }

    return { ok: true, data: updated }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้งาน: ' + err.message
    })
  }
})
