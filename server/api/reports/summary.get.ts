import { defineEventHandler, getQuery } from 'h3'
import { inMemoryAssessments } from '../assessments/index.post'
import { evaluationRounds } from '../rounds/index.get'
import { EVALUATION_CATEGORIES, EVALUATION_QUESTIONS } from '../../../shared/constants/questions'

// Seed realistic multi-committee mock assessments across rounds if empty
function ensureMockAssessments() {
  if (inMemoryAssessments.length === 0) {
    // อาคาร 15 รอบ 2570 - กรรมการ 2 คน
    inMemoryAssessments.push({
      id: 'mock-1',
      roundId: 'round-2570',
      buildingId: 'b-15',
      buildingName: 'อาคาร 15 (เฉลิมพระเกียรติ 50 พรรษา มหาวชิราลงกรณ)',
      responsibleStaffText: 'นางสมศรี ใจสะอาด, นางสมใจ รักษ์ดี',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น (ประธานกรรมการ)',
      assessedAt: '2026-10-15T09:30:00Z',
      totalScoreObtained: 162,
      totalMaxScore: 175,
      percentage: 92.57,
      grade: 'EXCELLENT',
      gradeLabel: 'ดีเยี่ยม',
      urgentProblems: '',
      scores: generateScores(92)
    })
    inMemoryAssessments.push({
      id: 'mock-2',
      roundId: 'round-2570',
      buildingId: 'b-15',
      buildingName: 'อาคาร 15 (เฉลิมพระเกียรติ 50 พรรษา มหาวชิราลงกรณ)',
      responsibleStaffText: 'นางสมศรี ใจสะอาด, นางสมใจ รักษ์ดี',
      assessorId: 'u3',
      assessorName: 'ผศ.ณัฐพงษ์ สิทธิศักดิ์ (กรรมการ)',
      assessedAt: '2026-10-15T10:15:00Z',
      totalScoreObtained: 156,
      totalMaxScore: 175,
      percentage: 89.14,
      grade: 'GOOD',
      gradeLabel: 'ดี',
      urgentProblems: 'ฝุ่นบริเวณหลังตู้ห้องประชุมชั้น 4',
      scores: generateScores(89)
    })

    // อาคาร 18 (ARIT) รอบ 2570 - กรรมการ 2 คน
    inMemoryAssessments.push({
      id: 'mock-3',
      roundId: 'round-2570',
      buildingId: 'b-18',
      buildingName: 'อาคาร 18 (สำนักวิทยบริการและเทคโนโลยีสารสนเทศ ARIT)',
      responsibleStaffText: 'นางปราณี ขยันยิ่ง',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น',
      assessedAt: '2026-10-18T13:45:00Z',
      totalScoreObtained: 168,
      totalMaxScore: 175,
      percentage: 96.0,
      grade: 'EXCELLENT',
      gradeLabel: 'ดีเยี่ยม',
      urgentProblems: '',
      scores: generateScores(96)
    })
    inMemoryAssessments.push({
      id: 'mock-4',
      roundId: 'round-2570',
      buildingId: 'b-18',
      buildingName: 'อาคาร 18 (สำนักวิทยบริการและเทคโนโลยีสารสนเทศ ARIT)',
      responsibleStaffText: 'นางปราณี ขยันยิ่ง',
      assessorId: 'u3',
      assessorName: 'ผศ.ณัฐพงษ์ สิทธิศักดิ์',
      assessedAt: '2026-10-18T14:30:00Z',
      totalScoreObtained: 165,
      totalMaxScore: 175,
      percentage: 94.28,
      grade: 'EXCELLENT',
      gradeLabel: 'ดีเยี่ยม',
      urgentProblems: '',
      scores: generateScores(94)
    })

    // อาคาร 22 รอบ 2570 - คะแนนต้องปรับปรุง
    inMemoryAssessments.push({
      id: 'mock-5',
      roundId: 'round-2570',
      buildingId: 'b-22',
      buildingName: 'อาคาร 22 (อาคารวิทยาศาสตร์และเทคโนโลยี)',
      responsibleStaffText: 'นางวันดี มีสุข',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น',
      assessedAt: '2026-10-20T11:00:00Z',
      totalScoreObtained: 118,
      totalMaxScore: 175,
      percentage: 67.42,
      grade: 'IMPROVEMENT',
      gradeLabel: 'ต้องปรับปรุง',
      urgentProblems: 'ถังขยะห้องน้ำล้นส่งกลิ่นรบกวน, พื้นห้องน้ำลื่นเสี่ยงอุบัติเหตุ',
      scores: generateScores(67, true)
    })

    // ข้อมูลย้อนหลังรอบปี 2568 (เพื่อใช้เปรียบเทียบ Cross-Round Trend)
    inMemoryAssessments.push({
      id: 'mock-prev-1',
      roundId: 'round-2568',
      buildingId: 'b-15',
      buildingName: 'อาคาร 15 (เฉลิมพระเกียรติ 50 พรรษา มหาวชิราลงกรณ)',
      responsibleStaffText: 'นางสมศรี ใจสะอาด',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น',
      assessedAt: '2025-11-10T10:00:00Z',
      totalScoreObtained: 150,
      totalMaxScore: 175,
      percentage: 85.71,
      grade: 'GOOD',
      gradeLabel: 'ดี',
      scores: generateScores(85)
    })
    inMemoryAssessments.push({
      id: 'mock-prev-2',
      roundId: 'round-2568',
      buildingId: 'b-18',
      buildingName: 'อาคาร 18 (สำนักวิทยบริการและเทคโนโลยีสารสนเทศ ARIT)',
      responsibleStaffText: 'นางปราณี ขยันยิ่ง',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น',
      assessedAt: '2025-11-12T14:00:00Z',
      totalScoreObtained: 161,
      totalMaxScore: 175,
      percentage: 92.0,
      grade: 'EXCELLENT',
      gradeLabel: 'ดีเยี่ยม',
      scores: generateScores(92)
    })
    inMemoryAssessments.push({
      id: 'mock-prev-3',
      roundId: 'round-2568',
      buildingId: 'b-22',
      buildingName: 'อาคาร 22 (อาคารวิทยาศาสตร์และเทคโนโลยี)',
      responsibleStaffText: 'นางวันดี มีสุข',
      assessorId: 'u2',
      assessorName: 'ดร.สมชาย ใจมั่น',
      assessedAt: '2025-11-15T11:00:00Z',
      totalScoreObtained: 126,
      totalMaxScore: 175,
      percentage: 72.0,
      grade: 'FAIR',
      gradeLabel: 'พอใช้ ควรปรับปรุงบางรายการ',
      scores: generateScores(72)
    })
  }
}

function generateScores(targetPct: number, hasUrgent: boolean = false) {
  const scores: any = {}
  for (let i = 1; i <= 35; i++) {
    let s = 5
    if (targetPct < 70) {
      s = (i % 3 === 0) ? 2 : (i % 2 === 0 ? 3 : 4)
    } else if (targetPct < 90) {
      s = (i % 4 === 0) ? 4 : 5
    }
    if (hasUrgent && (i === 14 || i === 15 || i === 27)) {
      s = 2
    }
    scores[i] = { score: s, isNA: false, defectNote: s <= 3 ? 'ต้องปรับปรุงความสะอาด' : '' }
  }
  return scores
}

export default defineEventHandler(async (event) => {
  ensureMockAssessments()

  const query = getQuery(event)
  const roundId = (query.roundId as string) || 'round-2570'

  // กรองเฉพาะการประเมินในรอบที่เลือก
  const currentAssessments = inMemoryAssessments.filter(a => (a.roundId || 'round-2570') === roundId)

  // 1. คำนวณคะแนนเฉลี่ยรายข้อย่อยของแต่ละอาคาร (Item-level consensus)
  const buildingsMap: Record<string, {
    buildingId: string
    buildingName: string
    responsibleStaff: string
    auditors: string[]
    evaluations: any[]
  }> = {}

  for (const a of currentAssessments) {
    const bId = a.buildingId || a.buildingName
    if (!buildingsMap[bId]) {
      buildingsMap[bId] = {
        buildingId: a.buildingId,
        buildingName: a.buildingName,
        responsibleStaff: a.responsibleStaffText,
        auditors: [],
        evaluations: []
      }
    }
    if (!buildingsMap[bId].auditors.includes(a.assessorName)) {
      buildingsMap[bId].auditors.push(a.assessorName)
    }
    buildingsMap[bId].evaluations.push(a)
  }

  const buildingAverages = Object.values(buildingsMap).map(b => {
    let totalScoreSum = 0
    let evaluatedQuestionsCount = 0
    const itemAverages: Record<number, number> = {}

    for (let qId = 1; qId <= 35; qId++) {
      let qScoresTotal = 0
      let qVotersCount = 0

      for (const ev of b.evaluations) {
        const item = ev.scores?.[qId]
        if (item && !item.isNA && item.score !== null && item.score !== undefined) {
          qScoresTotal += item.score
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

    let grade = 'URGENT_ACTION'
    let gradeLabel = 'ต้องเร่งแก้ไขและติดตามผล'
    let gradeColor = 'red'

    if (roundedPct >= 90) {
      grade = 'EXCELLENT'
      gradeLabel = 'ดีเยี่ยม'
      gradeColor = 'emerald'
    } else if (roundedPct >= 80) {
      grade = 'GOOD'
      gradeLabel = 'ดี'
      gradeColor = 'green'
    } else if (roundedPct >= 70) {
      grade = 'FAIR'
      gradeLabel = 'พอใช้ ควรปรับปรุงบางรายการ'
      gradeColor = 'amber'
    } else if (roundedPct >= 60) {
      grade = 'IMPROVEMENT'
      gradeLabel = 'ต้องปรับปรุง'
      gradeColor = 'orange'
    }

    const urgentNotes = b.evaluations.map(e => e.urgentProblems).filter(Boolean).join('; ')

    return {
      buildingId: b.buildingId,
      buildingName: b.buildingName,
      responsibleStaff: b.responsibleStaff,
      committeeCount: b.auditors.length,
      auditors: b.auditors,
      totalScoreObtained: Math.round(totalScoreSum * 10) / 10,
      totalMaxScore: maxScore,
      percentage: roundedPct,
      grade,
      gradeLabel,
      gradeColor,
      urgentNotes,
      itemAverages
    }
  }).sort((a, b) => b.percentage - a.percentage)

  // 2. การเปรียบเทียบแนวโน้มข้ามรอบประเมิน (Cross-Round Trend Comparison)
  const previousRoundId = 'round-2568'
  const previousAssessments = inMemoryAssessments.filter(a => a.roundId === previousRoundId)

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

  // 3. วิเคราะห์จุดบกพร่องและความเสี่ยงเร่งด่วนตามหมวด (Category Defect Hotspots)
  const categoryStats = EVALUATION_CATEGORIES.map(cat => {
    const catQuestions = EVALUATION_QUESTIONS.filter(q => q.categoryId === cat.id)
    const qIds = catQuestions.map(q => q.id)

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
  }).sort((a, b) => a.percentage - b.percentage)

  return {
    ok: true,
    currentRoundId: roundId,
    availableRounds: evaluationRounds,
    buildingAverages,
    trendComparison,
    categoryStats
  }
})
