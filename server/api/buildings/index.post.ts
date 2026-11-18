import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { saveBuildingAuditors } from '../../utils/settings'
import { resolveBuildingStaffData } from '../../utils/buildingStaff'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const body = await readBody(event)
  const { code, name, floors, description, staffNames, staffs, auditors } = body

  if (!code || !name) {
    throw createError({ statusCode: 400, message: 'กรุณาระบุรหัสอาคารและชื่ออาคาร' })
  }

  try {
    const resolvedStaffs = await resolveBuildingStaffData({ staffs, staffNames })
    const building = await prisma.building.create({
      data: {
        code: code.trim(),
        name: name.trim(),
        floors: floors ? parseInt(floors) : 1,
        description: description || null,
        staffs: {
          create: resolvedStaffs
        }
      },
      include: { staffs: true }
    })

    const savedAuditors = Array.isArray(auditors)
      ? await saveBuildingAuditors(building.id, auditors)
      : []

    return {
      ok: true,
      data: {
        ...building,
        auditors: savedAuditors
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลอาคารลงฐานข้อมูล: ' + err.message
    })
  }
})
