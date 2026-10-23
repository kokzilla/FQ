import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

const INITIAL_BUILDINGS = [
  {
    id: 'b-15',
    code: 'B15',
    name: 'อาคาร 15 (เฉลิมพระเกียรติ 50 พรรษา มหาวชิราลงกรณ)',
    floors: 9,
    description: 'อาคารเรียนรวมและศูนย์ปฏิบัติการ 9 ชั้น',
    staffs: [{ id: 's1', staffName: 'นางสมศรี ใจสะอาด (ชั้น 1-4)' }, { id: 's2', staffName: 'นางสมใจ รักษ์ดี (ชั้น 5-9)' }]
  },
  {
    id: 'b-18',
    code: 'B18',
    name: 'อาคาร 18 (สำนักวิทยบริการและเทคโนโลยีสารสนเทศ ARIT)',
    floors: 5,
    description: 'หอสมุดกลาง ศูนย์คอมพิวเตอร์และอินเทอร์เน็ต',
    staffs: [{ id: 's3', staffName: 'นางปราณี ขยันยิ่ง (หอสมุดและศูนย์คอมฯ)' }]
  },
  {
    id: 'b-22',
    code: 'B22',
    name: 'อาคาร 22 (อาคารวิทยาศาสตร์และเทคโนโลยี)',
    floors: 8,
    description: 'คณะวิทยาศาสตร์และห้องปฏิบัติการเคมี/ฟิสิกส์',
    staffs: [{ id: 's4', staffName: 'นางวันดี มีสุข' }]
  },
  {
    id: 'b-24',
    code: 'B24',
    name: 'อาคาร 24 (อาคารปฏิบัติการทางวิทยาศาสตร์และนวัตกรรม)',
    floors: 7,
    description: 'ศูนย์ความเป็นเลิศทางการวิจัยและนวัตกรรม',
    staffs: [{ id: 's5', staffName: 'นางสุภาพรรณ บัวแก้ว' }]
  },
  {
    id: 'b-01',
    code: 'B01',
    name: 'อาคาร 1 (อาคารอำนวยการและสำนักงานอธิการบดี)',
    floors: 3,
    description: 'สำนักงานอธิการบดี กองกลาง และกองนโยบายและแผน',
    staffs: [{ id: 's6', staffName: 'นางอำไพ พรหมประเสริฐ' }]
  }
]

if (!(globalThis as any).__DEFAULT_BUILDINGS) {
  (globalThis as any).__DEFAULT_BUILDINGS = [...INITIAL_BUILDINGS]
}

export default defineEventHandler(async () => {
  if (await isDbReady()) {
    try {
      const buildings = await prisma.building.findMany({
        where: { isActive: true },
        include: { staffs: true },
        orderBy: { code: 'asc' }
      })

      if (buildings.length > 0) {
        return { ok: true, data: buildings }
      }
    } catch (err) {}
  }

  return { ok: true, data: (globalThis as any).__DEFAULT_BUILDINGS }
})
