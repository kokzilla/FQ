import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const body = await readBody(event)
  const { userlogin, fullName, email, positionName, departmentId, role } = body

  if (!userlogin || !fullName || !role) {
    throw createError({ statusCode: 400, message: 'ข้อมูลบุคลากรไม่ครบถ้วน' })
  }

  try {
    const user = await prisma.user.upsert({
      where: { userlogin },
      update: { role, fullName, positionName, email },
      create: { userlogin, fullName, role, positionName, email, departmentId }
    })
    return { ok: true, data: user }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการกำหนดสิทธิ์บุคลากร: ' + err.message
    })
  }
})
