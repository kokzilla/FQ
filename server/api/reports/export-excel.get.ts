import { defineEventHandler, setResponseHeaders } from 'h3'
import { prisma } from '../../utils/prisma'
import { inMemoryAssessments } from '../assessments/index.post'

export default defineEventHandler(async (event) => {
  let assessments: any[] = []
  try {
    const dbList = await prisma.assessment.findMany({
      include: { building: true, assessor: true },
      orderBy: { createdAt: 'desc' }
    })
    if (dbList.length > 0) {
      assessments = dbList.map(a => ({
        buildingName: a.building?.name,
        assessorName: a.assessor?.fullName,
        responsibleStaffText: a.responsibleStaffText,
        assessedAt: a.assessedAt,
        totalScoreObtained: a.totalScoreObtained,
        totalMaxScore: a.totalMaxScore,
        percentage: a.percentage,
        grade: a.grade,
        urgentProblems: a.urgentProblems || '-',
        followUpResult: a.followUpResult || '-'
      }))
    }
  } catch (err) {
    // fallback
  }

  if (assessments.length === 0) {
    assessments = inMemoryAssessments.map(a => ({
      buildingName: a.buildingName,
      assessorName: a.assessorName,
      responsibleStaffText: a.responsibleStaffText,
      assessedAt: a.assessedAt,
      totalScoreObtained: a.totalScoreObtained,
      totalMaxScore: a.totalMaxScore,
      percentage: a.percentage,
      grade: a.gradeLabel,
      urgentProblems: a.urgentProblems || '-',
      followUpResult: a.followUpResult || '-'
    }))
  }

  // สร้างไฟล์ CSV สำหรับเปิดใน Excel ได้ทันที (รองรับ UTF-8 BOM สำหรับภาษาไทย)
  const headers = ['ลำดับ', 'ชื่ออาคาร', 'ผู้รับผิดชอบประจำอาคาร (แม่บ้าน)', 'ผู้ตรวจประเมิน', 'วันที่ประเมิน', 'คะแนนที่ได้', 'คะแนนเต็ม', 'คิดเป็นร้อยละ (%)', 'ระดับผลการประเมิน', 'จุดที่ต้องปรับปรุงเร่งด่วน', 'ผลตรวจติดตาม']
  
  const escapeCsv = (str: any) => `"${String(str ?? '').replace(/"/g, '""')}"`
  
  const csvRows = [
    headers.map(escapeCsv).join(','),
    ...assessments.map((item, index) => [
      index + 1,
      item.buildingName,
      item.responsibleStaffText,
      item.assessorName,
      new Date(item.assessedAt).toLocaleDateString('th-TH'),
      item.totalScoreObtained,
      item.totalMaxScore,
      item.percentage,
      item.grade,
      item.urgentProblems,
      item.followUpResult
    ].map(escapeCsv).join(','))
  ]

  const bom = '\uFEFF'
  const csvContent = bom + csvRows.join('\r\n')

  setResponseHeaders(event, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="BRU_Building_Evaluation_${Date.now()}.csv"`,
  })

  return csvContent
})
