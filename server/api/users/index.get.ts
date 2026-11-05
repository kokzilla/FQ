import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

export const localUsers: any[] = [
  { id: 'u1', userlogin: 'admin', fullName: 'ผู้ดูแลระบบ อาคารสถานที่', role: 'ADMIN', positionName: 'ผู้ดูแลระบบ' },
  { id: 'u-100174', userlogin: '100174', fullName: 'รองศาสตราจารย์ ดร. ศิราณี จุโฑปะมา', role: 'AUDITOR', positionName: 'ประธานกรรมการ', departmentId: '79', email: '100174@bru.ac.th' },
  { id: 'u-900522', userlogin: '900522', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. พิทยา พันธะไชย', role: 'AUDITOR', positionName: 'รองประธานกรรมการ', departmentId: '79', email: '900522@bru.ac.th' },
  { id: 'u-100196', userlogin: '100196', fullName: 'รองศาสตราจารย์ ดร. สุพัตรา รักการศิลป์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '0', email: '100196@bru.ac.th' },
  { id: 'u-500118', userlogin: '500118', fullName: 'อาจารย์ ดร. พนาสินธุ์ ศรีวิเศษ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '500118@bru.ac.th' },
  { id: 'u-400051', userlogin: '400051', fullName: 'อาจารย์ อัญญา มธุรเมธา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '123', email: '400051@bru.ac.th' },
  { id: 'u-100223', userlogin: '100223', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. นิจพร ณ พัทลุง', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100223@bru.ac.th' },
  { id: 'u-100061', userlogin: '100061', fullName: 'อาจารย์ วิชชา ภัทรนิธิคุณากร', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100061@bru.ac.th' },
  { id: 'u-100232', userlogin: '100232', fullName: 'อาจารย์ วิสาข์ แฝงเวียง', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '172', email: '100232@bru.ac.th' },
  { id: 'u-100014', userlogin: '100014', fullName: 'ผู้ช่วยศาสตราจารย์ วิไลวรรณ ศิริเมฆา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '94', email: '100014@bru.ac.th' },
  { id: 'u-440213', userlogin: '440213', fullName: 'อาจารย์ ดร. ศรีเพ็ญ พลเดช', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '440213@bru.ac.th' },
  { id: 'u-57023', userlogin: '57023', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. เอกชัย ธีรภัคสิริ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '57023@bru.ac.th' },
  { id: 'u-400015', userlogin: '400015', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. นพดล ธีระวงศ์ภิญโญ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '123', email: '400015@bru.ac.th' },
  { id: 'u-100113', userlogin: '100113', fullName: 'อาจารย์ ดร. ทิพวัลย์ แสนคำ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100113@bru.ac.th' },
  { id: 'u-440228', userlogin: '440228', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ผกามาศ บุตรสาลี', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '142', email: '440228@bru.ac.th' },
  { id: 'u-100180', userlogin: '100180', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. บรรเจิด สอนสุภาพ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100180@bru.ac.th' },
  { id: 'u-100117', userlogin: '100117', fullName: 'ผู้ช่วยศาสตราจารย์ วัชระ วชิรภัทรกุล', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '172', email: '100117@bru.ac.th' },
  { id: 'u-900131', userlogin: '900131', fullName: 'อาจารย์ กนิษฐา จอดนอก', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '198', email: '900131@bru.ac.th' },
  { id: 'u-100080', userlogin: '100080', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. สมศักดิ์ จีวัฒนา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100080@bru.ac.th' },
  { id: 'u-100189', userlogin: '100189', fullName: 'รองศาสตราจารย์ ดร. นฤมล สมคุณา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100189@bru.ac.th' },
  { id: 'u-100114', userlogin: '100114', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ณัฐพล แสนคำ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100114@bru.ac.th' },
  { id: 'u-400011', userlogin: '400011', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. อโศก ไทยจันทรารักษ์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '400011@bru.ac.th' },
  { id: 'u-100052', userlogin: '100052', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ธิติ ปัญญาอินทร์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '100052@bru.ac.th' },
  { id: 'u-100109', userlogin: '100109', fullName: 'อาจารย์ พวงเพชร ราชประโคน', role: 'AUDITOR', positionName: 'กรรมการและเลขานุการ', departmentId: '1', email: '100109@bru.ac.th' },
  { id: 'u-300036', userlogin: '300036', fullName: 'นาย ลัด พอกกลาง', role: 'AUDITOR', positionName: 'กรรมการและเลขานุการ', departmentId: '40', email: '300036@bru.ac.th' },
  { id: 'u-4300016', userlogin: '4300016', fullName: 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '4300016@bru.ac.th' },
  { id: 'u-600034', userlogin: '600034', fullName: 'นาย ประสิทธิ์ จันลา', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600034@bru.ac.th' },
  { id: 'u-600100', userlogin: '600100', fullName: 'นาย อภิสิทธิ์ แพนแก้ว', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600100@bru.ac.th' },
  { id: 'u-5500010', userlogin: '5500010', fullName: 'ดุสิต เพชรเนื้อนิล', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '5500010@bru.ac.th' },
  { id: 'u-600099', userlogin: '600099', fullName: 'อธิพงศ์ แต้มสี', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600099@bru.ac.th' },
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
