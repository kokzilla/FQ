export interface EvaluationQuestion {
  id: number
  categoryId: number
  itemNumber: number
  title: string
  maxScore: number
}

export interface EvaluationCategory {
  id: number
  name: string
  order: number
}

export interface ScoreItemInput {
  questionItemId: number
  score: number | null // 1-5 หรือ null ถ้า N/A
  isNA: boolean
  defectNote?: string
  photoUrl?: string
}

export interface EvaluationResult {
  totalItems: number
  evaluatedItems: number
  naItems: number
  totalScoreObtained: number
  totalMaxScore: number
  percentage: number
  gradeKey: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'IMPROVEMENT' | 'URGENT_ACTION'
  gradeLabel: string
  gradeColor: 'emerald' | 'green' | 'amber' | 'orange' | 'red'
}

export function calculateEvaluation(
  scores: Record<number, { score: number | null; isNA: boolean; defectNote?: string; photoUrl?: string }>
): EvaluationResult {
  let totalScoreObtained = 0
  let evaluatedItems = 0
  let naItems = 0

  for (const itemId in scores) {
    const item = scores[itemId]
    if (item.isNA) {
      naItems++
    } else if (item.score !== null && item.score !== undefined) {
      totalScoreObtained += item.score
      evaluatedItems++
    }
  }

  const totalMaxScore = evaluatedItems * 5
  const percentage = totalMaxScore > 0 ? (totalScoreObtained / totalMaxScore) * 100 : 0
  const roundedPct = Math.round(percentage * 100) / 100

  let gradeKey: EvaluationResult['gradeKey'] = 'URGENT_ACTION'
  let gradeLabel = 'ต้องเร่งแก้ไขและติดตามผล'
  let gradeColor: EvaluationResult['gradeColor'] = 'red'

  if (roundedPct >= 90) {
    gradeKey = 'EXCELLENT'
    gradeLabel = 'ดีเยี่ยม'
    gradeColor = 'emerald'
  } else if (roundedPct >= 80) {
    gradeKey = 'GOOD'
    gradeLabel = 'ดี'
    gradeColor = 'green'
  } else if (roundedPct >= 70) {
    gradeKey = 'FAIR'
    gradeLabel = 'พอใช้ ควรปรับปรุงบางรายการ'
    gradeColor = 'amber'
  } else if (roundedPct >= 60) {
    gradeKey = 'IMPROVEMENT'
    gradeLabel = 'ต้องปรับปรุง'
    gradeColor = 'orange'
  }

  return {
    totalItems: 35,
    evaluatedItems,
    naItems,
    totalScoreObtained,
    totalMaxScore,
    percentage: roundedPct,
    gradeKey,
    gradeLabel,
    gradeColor,
  }
}
