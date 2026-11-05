import { defineEventHandler, getQuery, setResponseHeaders } from 'h3'
import { createRequire } from 'node:module'
import { inMemoryAssessments } from '../assessments/index.post'
import { getDynamicQuestionsAndCategories } from '../questions/index.get'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'
import { getColorCriteriaSettings } from '../../utils/settings'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  const roundId = (query.roundId as string) || 'round-2570'
  const exportType = (query.type as string) || 'building' // 'building' | 'staff'
  const { questions: activeQuestions } = await getDynamicQuestionsAndCategories()
  const allQuestionIds = activeQuestions.map((q: any) => q.id)

  // ดึงข้อมูลการประเมินทั้งหมดจากฐานข้อมูล PostgreSQL
  let allAssessments: any[] = []
  if (await isDbReady()) {
    try {
      const dbAssessments = await prisma.assessment.findMany({
        include: { building: true, assessor: true, scores: true },
        orderBy: { createdAt: 'desc' }
      })
      allAssessments = dbAssessments.map(d => {
        const scoresMap: any = {}
        for (const s of d.scores) {
          scoresMap[s.questionItemId] = {
            score: s.score,
            isNA: s.isNA,
            defectNote: s.defectNote
          }
        }
        return {
          id: d.id,
          roundId: d.roundId || 'round-2570',
          buildingId: d.buildingId,
          buildingName: d.building?.name || 'อาคาร',
          staffId: (d as any).staffId || null,
          responsibleStaffText: d.responsibleStaffText,
          assessorId: d.assessorId,
          assessorName: d.assessor?.fullName || 'ผู้ตรวจประเมิน',
          assessedAt: d.assessedAt.toISOString(),
          totalScoreObtained: d.totalScoreObtained,
          totalMaxScore: d.totalMaxScore,
          percentage: d.percentage,
          grade: d.grade,
          gradeLabel: d.grade,
          urgentProblems: d.urgentProblems || '',
          scores: scoresMap
        }
      })
    } catch (e) {}
  } else {
    allAssessments = [...inMemoryAssessments]
  }

  const currentAssessments = allAssessments.filter(a => (a.roundId || 'round-2570') === roundId)

  const wb = XLSX.utils.book_new()
  let filename = ''

  if (exportType === 'staff') {
    // -------------------------------------------------------------
    // EXCEL EXPORT: STAFF TABULAR SUMMARY (.xlsx)
    // -------------------------------------------------------------
    const staffMap: Record<string, {
      staffName: string
      buildingName: string
      auditors: string[]
      evaluations: any[]
    }> = {}

    for (const a of currentAssessments) {
      const sName = (a.responsibleStaffText || 'ไม่ระบุ').trim()
      const bId = a.buildingId || a.buildingName || ''
      const staffKey = `${bId}___${sName}`

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffName: sName,
          buildingName: a.buildingName || 'ไม่ระบุอาคาร',
          auditors: [],
          evaluations: []
        }
      }
      if (a.assessorName && !staffMap[staffKey].auditors.includes(a.assessorName)) {
        staffMap[staffKey].auditors.push(a.assessorName)
      }
      staffMap[staffKey].evaluations.push(a)
    }

    const staffList = Object.values(staffMap).map(s => {
      let totalScoreSum = 0
      let evaluatedQuestionsCount = 0

      for (const qId of allQuestionIds) {
        let qScoresTotal = 0
        let qVotersCount = 0

        for (const ev of s.evaluations) {
          const item = ev.scores?.[qId]
          if (item && !item.isNA && item.score !== null && item.score !== undefined) {
            qScoresTotal += Number(item.score)
            qVotersCount++
          }
        }

        if (qVotersCount > 0) {
          totalScoreSum += (qScoresTotal / qVotersCount)
          evaluatedQuestionsCount++
        }
      }

      const avgScore = evaluatedQuestionsCount > 0 ? (totalScoreSum / evaluatedQuestionsCount) : 0
      const roundedScore = Math.round(avgScore * 100) / 100
      const urgentNotes = s.evaluations.map(e => e.urgentProblems).filter(Boolean).join('; ')

      return {
        staffName: s.staffName,
        buildingName: s.buildingName,
        committeeCount: s.auditors.length,
        auditorsStr: s.auditors.join(', '),
        score: roundedScore,
        urgentNotes: urgentNotes || '-'
      }
    }).sort((a, b) => b.score - a.score)

    const headers = [
      'ลำดับ',
      'ชื่อผู้ปฏิบัติงาน',
      'อาคารที่สังกัด/รับผิดชอบ',
      'คะแนนเฉลี่ย (0-5.00 คะแนน)',
      'จำนวนกรรมการ (ท่าน)',
      'รายชื่อคณะกรรมการที่ประเมิน',
      'จุดที่ต้องปรับปรุงเร่งด่วน'
    ]

    const rows = staffList.map((item, idx) => [
      idx + 1,
      item.staffName,
      item.buildingName,
      item.score,
      item.committeeCount,
      item.auditorsStr,
      item.urgentNotes
    ])

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    ws['!cols'] = [
      { wch: 8 },  // ลำดับ
      { wch: 30 }, // ชื่อผู้ปฏิบัติงาน
      { wch: 32 }, // อาคารที่สังกัด
      { wch: 22 }, // คะแนนเฉลี่ย
      { wch: 18 }, // จำนวนกรรมการ
      { wch: 38 }, // รายชื่อกรรมการ
      { wch: 45 }  // จุดปรับปรุง
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'สรุปผลประเมินรายบุคคล')
    filename = `BRU_รายงานสรุปคะแนนบุคลากร_${roundId}_${Date.now()}.xlsx`

  } else {
    // -------------------------------------------------------------
    // EXCEL EXPORT: BUILDING TABULAR SUMMARY (.xlsx) (Default)
    // -------------------------------------------------------------
    const buildingsMap: Record<string, {
      buildingName: string
      responsibleStaffList: Set<string>
      auditors: string[]
      evaluations: any[]
    }> = {}

    for (const a of currentAssessments) {
      const bId = a.buildingId || a.buildingName
      if (!buildingsMap[bId]) {
        buildingsMap[bId] = {
          buildingName: a.buildingName,
          responsibleStaffList: new Set(),
          auditors: [],
          evaluations: []
        }
      }
      if (a.responsibleStaffText) {
        buildingsMap[bId].responsibleStaffList.add(a.responsibleStaffText.trim())
      }
      if (a.assessorName && !buildingsMap[bId].auditors.includes(a.assessorName)) {
        buildingsMap[bId].auditors.push(a.assessorName)
      }
      buildingsMap[bId].evaluations.push(a)
    }

    const buildingList = Object.values(buildingsMap).map(b => {
      let totalScoreSum = 0
      let evaluatedQuestionsCount = 0

      for (const qId of allQuestionIds) {
        let qScoresTotal = 0
        let qVotersCount = 0

        for (const ev of b.evaluations) {
          const item = ev.scores?.[qId]
          if (item && !item.isNA && item.score !== null && item.score !== undefined) {
            qScoresTotal += Number(item.score)
            qVotersCount++
          }
        }

        if (qVotersCount > 0) {
          totalScoreSum += (qScoresTotal / qVotersCount)
          evaluatedQuestionsCount++
        }
      }

      const avgScore = evaluatedQuestionsCount > 0 ? (totalScoreSum / evaluatedQuestionsCount) : 0
      const roundedScore = Math.round(avgScore * 100) / 100
      const urgentNotes = b.evaluations.map(e => e.urgentProblems).filter(Boolean).join('; ')

      return {
        buildingName: b.buildingName,
        responsibleStaff: Array.from(b.responsibleStaffList).join(', ') || 'ไม่ระบุ',
        committeeCount: b.auditors.length,
        auditorsStr: b.auditors.join(', '),
        score: roundedScore,
        urgentNotes: urgentNotes || '-'
      }
    }).sort((a, b) => b.score - a.score)

    const headers = [
      'ลำดับ',
      'ชื่ออาคาร',
      'ผู้รับผิดชอบ',
      'คะแนนเฉลี่ย (0-5.00 คะแนน)',
      'จำนวนกรรมการ (ท่าน)',
      'รายชื่อคณะกรรมการที่ตรวจ',
      'จุดที่ต้องปรับปรุงเร่งด่วน'
    ]

    const rows = buildingList.map((item, idx) => [
      idx + 1,
      item.buildingName,
      item.responsibleStaff,
      item.score,
      item.committeeCount,
      item.auditorsStr,
      item.urgentNotes
    ])

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    ws['!cols'] = [
      { wch: 8 },  // ลำดับ
      { wch: 35 }, // ชื่ออาคาร
      { wch: 28 }, // ผู้รับผิดชอบ
      { wch: 22 }, // คะแนนเฉลี่ย
      { wch: 18 }, // จำนวนกรรมการ
      { wch: 38 }, // รายชื่อกรรมการ
      { wch: 45 }  // จุดปรับปรุง
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'สรุปคะแนนเฉลี่ยอาคาร')
    filename = `BRU_รายงานสรุปคะแนนอาคาร_${roundId}_${Date.now()}.xlsx`
  }

  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setResponseHeaders(event, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  })

  return excelBuffer
})
