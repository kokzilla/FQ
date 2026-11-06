import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { role, fullName, positionName } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing user id' })
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(fullName && { fullName }),
        ...(positionName && { positionName })
      }
    })
    return { ok: true, data: updated }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้งาน: ' + err.message
    })
  }
})
