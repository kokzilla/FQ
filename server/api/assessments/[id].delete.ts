import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getVerifiedSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ไม่พบรหัสผลการประเมินที่ต้องการลบ' })
  }

  const session = getVerifiedSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการลบผลการประเมิน' })
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { assessor: true }
  })

  if (!assessment) {
    throw createError({ statusCode: 404, message: 'ไม่พบผลการประเมินนี้ในระบบ' })
  }

  const isOwner =
    assessment.assessorId === session.id ||
    assessment.assessorId === session.userlogin ||
    (assessment.assessor && assessment.assessor.userlogin === session.userlogin)

  if (session.role !== 'ADMIN' && !isOwner) {
    throw createError({
      statusCode: 403,
      message: 'คุณไม่มีสิทธิ์ลบผลการประเมินของกรรมการท่านอื่น'
    })
  }

  try {
    await prisma.assessment.delete({
      where: { id }
    })
    return {
      ok: true,
      message: 'ลบผลการประเมินเรียบร้อยแล้ว'
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการลบผลการประเมิน: ' + (err.message || err)
    })
  }
})
