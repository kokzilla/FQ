import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export const localUsers: any[] = [
  { id: 'u1', userlogin: 'admin', fullName: 'ผู้ดูแลระบบ อาคารสถานที่', role: 'ADMIN', positionName: 'ผู้ดูแลระบบ' },
  { id: 'u2', userlogin: 'somchai', fullName: 'ดร.สมชาย ใจมั่น', role: 'AUDITOR', positionName: 'ประธานกรรมการตรวจประเมินอาคาร' },
  { id: 'u3', userlogin: 'nattapong', fullName: 'ผศ.ณัฐพงษ์ สิทธิศักดิ์', role: 'AUDITOR', positionName: 'กรรมการตรวจประเมิน' },
  { id: 'u4', userlogin: 'pranee', fullName: 'นางปราณี ขยันยิ่ง', role: 'HOUSEKEEPER', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)' },
]

export default defineEventHandler(async () => {
  if (await isDbReady()) {
    try {
      const list = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      })
      if (list.length > 0) return { ok: true, data: list }
    } catch (e) {}
  }

  return { ok: true, data: localUsers }
})
