import { defineEventHandler, getQuery, createError } from 'h3'
import { getAllEvaluationRounds } from '../rounds/index.get'
import { getDynamicQuestionsAndCategories } from '../questions/index.get'
import { prisma } from '../../utils/prisma'
import { requireDatabase } from '../../utils/dbState'
import { getColorCriteriaSettings, evaluateColorGrade } from '../../utils/settings'

export default defineEventHandler(async (event) => {
  await requireDatabase()

  const query = getQuery(event)
  const roundId = (query.roundId as string) || 'round-2570'

  // ดึงข้อมูลการประเมินจากฐานข้อมูล PostgreSQL
  let allAssessments: any[] = []
  try {
    const dbAssessments = await prisma.assessment.findMany({
      include: {
        building: {
          include: {
            staffs: true
          }
        },
        assessor: true,
        scores: true
      },
      orderBy: { createdAt: 'desc' }
    })
    allAssessments = dbAssessments.map(d => {
      const scoresMap: any = {}
      for (const s of d.scores) {
        scoresMap[s.questionItemId] = {
          score: s.score,
          isNA: s.isNA,
          defectNote: s.defectNote,
          photoUrl: s.photoUrl
        }
      }
      return {
        id: d.id,
        roundId: d.roundId || 'round-2570',
        buildingId: d.buildingId,
        buildingName: d.building?.name || 'อาคาร',
        buildingStaffs: d.building?.staffs || [],
        staffId: (d as any).staffId || null,
        responsibleStaffText: d.responsibleStaffText,
        assessorId: d.assessorId,
        assessorName: d.assessor?.fullName || 'ผู้ตรวจประเมิน',
        assessorPosition: d.assessor?.positionName || 'กรรมการ',
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
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายงานจากฐานข้อมูล: ' + e.message
    })
  }

  // ดึงการตั้งค่าเกณฑ์สี รอบการประเมิน และรายการข้อคำถามล่าสุด
  const [colorCriteria, availableRounds, { categories: activeCategories, questions: activeQuestions }] = await Promise.all([
    getColorCriteriaSettings(),
    getAllEvaluationRounds(),
    getDynamicQuestionsAndCategories()
  ])
  const allQuestionIds = activeQuestions.map((q: any) => q.id)

  // กรองเฉพาะการประเมินในรอบที่เลือก
  const currentAssessments = allAssessments.filter(a => (a.roundId || 'round-2570') === roundId)

  // ลำดับความสำคัญของตำแหน่งกรรมการสำหรับจัดเรียงในตาราง
  const positionRankMap: Record<string, number> = {
    'ประธานกรรมการ': 1,
    'รองประธานกรรมการ': 2,
    'กรรมการ': 3,
    'กรรมการและเลขานุการ': 4,
    'กรรมการและผู้ช่วยเลขานุการ': 5
  }

  // 1. คำนวณคะแนนเฉลี่ยรายข้อย่อยของแต่ละอาคาร (Building consensus)
  const buildingsMap: Record<string, {
    buildingId: string
    buildingName: string
    registeredStaffs: any[]
    responsibleStaffList: Set<string>
    auditors: string[]
    evaluations: any[]
  }> = {}

  for (const a of currentAssessments) {
    const bId = a.buildingId || a.buildingName
    if (!buildingsMap[bId]) {
      buildingsMap[bId] = {
        buildingId: a.buildingId,
        buildingName: a.buildingName,
        registeredStaffs: a.buildingStaffs || [],
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

  const buildingAverages = Object.values(buildingsMap).map(b => {
    let totalScoreSum = 0
    let evaluatedQuestionsCount = 0
    const itemAverages: Record<number, number> = {}

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
        const qAvg = qScoresTotal / qVotersCount
        itemAverages[qId] = Math.round(qAvg * 100) / 100
        totalScoreSum += qAvg
        evaluatedQuestionsCount++
      }
    }

    const maxScore = evaluatedQuestionsCount * 5
    const percentage = maxScore > 0 ? (totalScoreSum / maxScore) * 100 : 0
    const roundedPct = Math.round(percentage * 100) / 100

    // คำนวณคะแนนเฉลี่ยสเกล 0-5.00 คะแนน
    const avgScore = evaluatedQuestionsCount > 0 ? (totalScoreSum / evaluatedQuestionsCount) : 0
    const roundedScore = Math.round(avgScore * 100) / 100

    // ประเมินผลระดับสีและป้ายกำกับตามเกณฑ์สีอาคาร
    const { gradeColor, gradeLabel, levelKey } = evaluateColorGrade(roundedScore, colorCriteria.building)

    const urgentNotes = b.evaluations.map(e => e.urgentProblems).filter(Boolean).join('; ')

    // จัดกลุ่มกรรมการและผู้รับผิดชอบที่กรรมการประเมินต่อท้ายชื่อกรรมการ
    const auditorStaffMap: Record<string, Set<string>> = {}
    for (const ev of b.evaluations) {
      const aName = (ev.assessorName || 'ผู้ตรวจประเมิน').trim()
      if (!auditorStaffMap[aName]) {
        auditorStaffMap[aName] = new Set()
      }
      const sText = (ev.responsibleStaffText || '').trim()
      if (sText && sText !== 'ไม่ระบุ') {
        auditorStaffMap[aName].add(sText)
      }
    }

    const auditorDetails = b.auditors.map((aName: string) => {
      const staffSet = auditorStaffMap[aName]
      const staffArray = staffSet ? Array.from(staffSet) : []
      const staffStr = staffArray.length > 0 ? staffArray.join(', ') : ''
      return {
        name: aName,
        staff: staffStr,
        displayText: staffStr ? `${aName} (ผู้รับผิดชอบที่ประเมิน: ${staffStr})` : aName
      }
    })

    // สร้างตาราง Matrix: หัวคอลัมน์คือผู้รับผิดชอบ และแถวคือกรรมการ (ตำแหน่ง + ชื่อ)
    const staffNames = new Set<string>()
    for (const ev of b.evaluations) {
      const sName = (ev.responsibleStaffText || '').trim()
      if (sName && sName !== 'ไม่ระบุ') {
        staffNames.add(sName)
      }
    }
    if (b.registeredStaffs && b.registeredStaffs.length > 0) {
      for (const st of b.registeredStaffs) {
        if (st.staffName && st.staffName.trim()) {
          staffNames.add(st.staffName.trim())
        }
      }
    }
    if (staffNames.size === 0) {
      staffNames.add('ไม่ระบุ')
    }

    const staffColumns = Array.from(staffNames).map(staffName => {
      const matchedEvals = b.evaluations.filter(ev => {
        const evStaff = (ev.responsibleStaffText || '').trim()
        if (staffName === 'ไม่ระบุ') {
          return !evStaff || evStaff === 'ไม่ระบุ'
        }
        return evStaff === staffName || (!evStaff && staffNames.size === 1)
      })

      const auditorMap = new Map<string, any>()
      for (const ev of matchedEvals) {
        const aKey = ev.assessorId || ev.assessorName
        if (!auditorMap.has(aKey)) {
          const pos = ev.assessorPosition || 'กรรมการ'
          const name = ev.assessorName || 'ผู้ตรวจประเมิน'
          auditorMap.set(aKey, {
            assessorId: aKey,
            position: pos,
            name: name,
            fullDisplay: `${pos} ${name}`,
            assessedAt: ev.assessedAt,
            percentage: ev.percentage
          })
        }
      }

      const auditors = Array.from(auditorMap.values()).sort((a, b) => {
        const rankA = positionRankMap[a.position] || 99
        const rankB = positionRankMap[b.position] || 99
        if (rankA !== rankB) return rankA - rankB
        return a.name.localeCompare(b.name, 'th')
      })

      return {
        staffName,
        auditors,
        auditorCount: auditors.length
      }
    })

    const maxRows = Math.max(...staffColumns.map(c => c.auditors.length), 0)
    const committeeMatrix = {
      buildingName: b.buildingName,
      columns: staffColumns,
      maxRows
    }

    return {
      buildingId: b.buildingId,
      buildingName: b.buildingName,
      responsibleStaff: Array.from(b.responsibleStaffList).join(', ') || 'ไม่ระบุ',
      responsibleStaffList: Array.from(b.responsibleStaffList).filter(s => s && s !== 'ไม่ระบุ'),
      responsibleStaffCount: Array.from(b.responsibleStaffList).filter(s => s && s !== 'ไม่ระบุ').length,
      committeeCount: b.auditors.length,
      auditors: b.auditors,
      auditorDetails,
      committeeMatrix,
      totalScoreObtained: Math.round(totalScoreSum * 10) / 10,
      totalMaxScore: maxScore,
      score: roundedScore,
      scoreFormatted: roundedScore.toFixed(2),
      percentage: roundedPct,
      grade: levelKey,
      gradeLabel,
      gradeColor,
      urgentNotes,
      itemAverages
    }
  }).sort((a, b) => b.score - a.score)

  // 2. คำนวณคะแนนเฉลี่ยรายบุคคลของผู้ปฏิบัติงาน (Individual Staff Consensus)
  const staffMap: Record<string, {
    staffKey: string
    staffId: string | null
    staffName: string
    buildingId: string
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
        staffKey,
        staffId: a.staffId || null,
        staffName: sName,
        buildingId: a.buildingId || '',
        buildingName: a.buildingName || '',
        auditors: [],
        evaluations: []
      }
    }
    if (a.assessorName && !staffMap[staffKey].auditors.includes(a.assessorName)) {
      staffMap[staffKey].auditors.push(a.assessorName)
    }
    staffMap[staffKey].evaluations.push(a)
  }

  const staffAverages = Object.values(staffMap).map(s => {
    // จำกัดการคิดคะแนนเฉลี่ยของผู้ปฏิบัติงานจากผู้ประเมินสูงสุดไม่เกิน 5 คนแรก (เรียงตามลำดับการประเมินก่อน-หลัง)
    const sortedByFirst = [...s.evaluations].sort((a, b) => new Date(a.assessedAt).getTime() - new Date(b.assessedAt).getTime())
    const seenAssessors = new Set<string>()
    const cappedEvaluations: any[] = []
    for (const ev of sortedByFirst) {
      const key = ev.assessorId || ev.assessorName || ev.id
      if (!seenAssessors.has(key)) {
        seenAssessors.add(key)
        cappedEvaluations.push(ev)
        if (cappedEvaluations.length >= 5) break
      }
    }
    const cappedAuditors = Array.from(new Set(cappedEvaluations.map(e => e.assessorName).filter(Boolean)))

    let totalScoreSum = 0
    let evaluatedQuestionsCount = 0
    const itemAverages: Record<number, number> = {}

    for (const qId of allQuestionIds) {
      let qScoresTotal = 0
      let qVotersCount = 0

      for (const ev of cappedEvaluations) {
        const item = ev.scores?.[qId]
        if (item && !item.isNA && item.score !== null && item.score !== undefined) {
          qScoresTotal += Number(item.score)
          qVotersCount++
        }
      }

      if (qVotersCount > 0) {
        const qAvg = qScoresTotal / qVotersCount
        itemAverages[qId] = Math.round(qAvg * 100) / 100
        totalScoreSum += qAvg
        evaluatedQuestionsCount++
      }
    }

    const maxScore = evaluatedQuestionsCount * 5
    const percentage = maxScore > 0 ? (totalScoreSum / maxScore) * 100 : 0
    const roundedPct = Math.round(percentage * 100) / 100

    // คำนวณคะแนนเฉลี่ยสเกล 0-5.00 คะแนน
    const avgScore = evaluatedQuestionsCount > 0 ? (totalScoreSum / evaluatedQuestionsCount) : 0
    const roundedScore = Math.round(avgScore * 100) / 100

    // ประเมินผลระดับสีและป้ายกำกับตามเกณฑ์สีบุคลากร
    const { gradeColor, gradeLabel, levelKey } = evaluateColorGrade(roundedScore, colorCriteria.staff)

    const urgentNotes = cappedEvaluations.map(e => e.urgentProblems).filter(Boolean).join('; ')

    // สร้าง committeeMatrix สำหรับผู้ปฏิบัติงานรายนี้ (1 คอลัมน์)
    const staffAuditorMap = new Map<string, any>()
    for (const ev of cappedEvaluations) {
      const aKey = ev.assessorId || ev.assessorName
      if (!staffAuditorMap.has(aKey)) {
        const pos = ev.assessorPosition || 'กรรมการ'
        const name = ev.assessorName || 'ผู้ตรวจประเมิน'
        staffAuditorMap.set(aKey, {
          assessorId: aKey,
          position: pos,
          name: name,
          fullDisplay: `${pos} ${name}`,
          assessedAt: ev.assessedAt,
          percentage: ev.percentage
        })
      }
    }
    const staffSortedAuditors = Array.from(staffAuditorMap.values()).sort((a, b) => {
      const rankA = positionRankMap[a.position] || 99
      const rankB = positionRankMap[b.position] || 99
      if (rankA !== rankB) return rankA - rankB
      return a.name.localeCompare(b.name, 'th')
    })
    const committeeMatrix = {
      buildingName: s.buildingName || '',
      columns: [
        {
          staffName: s.staffName,
          auditors: staffSortedAuditors,
          auditorCount: staffSortedAuditors.length
        }
      ],
      maxRows: staffSortedAuditors.length
    }

    return {
      staffKey: s.staffKey,
      staffId: s.staffId,
      staffName: s.staffName,
      buildingId: s.buildingId,
      buildingName: s.buildingName,
      committeeCount: cappedAuditors.length,
      auditors: cappedAuditors,
      committeeMatrix,
      totalScoreObtained: Math.round(totalScoreSum * 10) / 10,
      totalMaxScore: maxScore,
      score: roundedScore,
      scoreFormatted: roundedScore.toFixed(2),
      percentage: roundedPct,
      grade: levelKey,
      gradeLabel,
      gradeColor,
      urgentNotes,
      evaluationsCount: cappedEvaluations.length,
      evaluations: cappedEvaluations.map(e => ({
        id: e.id,
        assessorName: e.assessorName,
        score: e.totalMaxScore > 0 ? (e.totalScoreObtained / (e.totalMaxScore / 5)).toFixed(2) : '0.00',
        assessedAt: e.assessedAt
      }))
    }
  }).sort((a, b) => b.score - a.score)

  // 3. การเปรียบเทียบแนวโน้มข้ามรอบประเมิน (Cross-Round Trend Comparison)
  const currentRoundIdx = availableRounds.findIndex((r: any) => r.id === roundId)
  const previousRoundObj = currentRoundIdx >= 0 && currentRoundIdx + 1 < availableRounds.length
    ? availableRounds[currentRoundIdx + 1]
    : availableRounds.find((r: any) => r.id !== roundId)
  const previousRoundId = previousRoundObj?.id || 'round-2568'
  const previousAssessments = allAssessments.filter(a => a.roundId === previousRoundId)

  const trendComparison = buildingAverages.map(curr => {
    const prevMatches = previousAssessments.filter(a => a.buildingId === curr.buildingId || a.buildingName === curr.buildingName)
    let prevPct = null
    if (prevMatches.length > 0) {
      const avg = prevMatches.reduce((acc, val) => acc + val.percentage, 0) / prevMatches.length
      prevPct = Math.round(avg * 100) / 100
    }

    let diff = null
    let trend = 'NEW' // 'UP', 'DOWN', 'EQUAL'
    if (prevPct !== null) {
      diff = Math.round((curr.percentage - prevPct) * 100) / 100
      if (diff > 0.5) trend = 'UP'
      else if (diff < -0.5) trend = 'DOWN'
      else trend = 'EQUAL'
    }

    return {
      buildingId: curr.buildingId,
      buildingName: curr.buildingName,
      currentRoundPercentage: curr.percentage,
      previousRoundPercentage: prevPct,
      diff,
      trend
    }
  })

  // 4. วิเคราะห์จุดบกพร่องและความเสี่ยงเร่งด่วนตามหมวด (Category Defect Hotspots)
  const categoryStats = activeCategories.map((cat: any) => {
    const catQuestions = activeQuestions.filter((q: any) => q.categoryId === cat.id)
    const qIds = catQuestions.map((q: any) => q.id)

    let totalScore = 0
    let count = 0
    let defectCount = 0

    for (const b of buildingAverages) {
      for (const qId of qIds) {
        if (b.itemAverages[qId] !== undefined) {
          totalScore += b.itemAverages[qId]
          count++
          if (b.itemAverages[qId] <= 3) {
            defectCount++
          }
        }
      }
    }

    const avgScoreOutOf5 = count > 0 ? totalScore / count : 5
    const categoryPct = Math.round((avgScoreOutOf5 / 5) * 100 * 10) / 10

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      avgScoreOutOf5: Math.round(avgScoreOutOf5 * 100) / 100,
      percentage: categoryPct,
      defectCount,
      isRiskHotspot: categoryPct < 75 || defectCount > 2
    }
  }).sort((a: any, b: any) => a.percentage - b.percentage)

  return {
    ok: true,
    currentRoundId: roundId,
    previousRoundId,
    availableRounds,
    colorCriteria,
    buildingAverages,
    staffAverages,
    trendComparison,
    categoryStats
  }
})
