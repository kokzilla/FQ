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
  averageScore: number
  gradeKey: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'IMPROVEMENT' | 'URGENT_ACTION'
  gradeLabel: string
  gradeColor: 'emerald' | 'green' | 'amber' | 'orange' | 'red'
}

export interface EvaluationOptions {
  totalItems?: number
  greenMin?: number
  yellowMin?: number
  greenLabel?: string
  yellowLabel?: string
  redLabel?: string
}

export function calculateEvaluation(
  scores: Record<number, { score: number | null; isNA: boolean; defectNote?: string; photoUrl?: string }>,
  options?: EvaluationOptions
): EvaluationResult {
  let totalScoreObtained = 0
  let evaluatedItems = 0
  let naItems = 0

  for (const itemId in scores) {
    const item = scores[itemId]
    if (!item) continue
    if (item.isNA) {
      naItems++
    } else if (item.score !== null && item.score !== undefined) {
      totalScoreObtained += Number(item.score)
      evaluatedItems++
    }
  }

  const keysCount = Object.keys(scores || {}).length
  const totalItems = options?.totalItems ?? (keysCount > 0 ? keysCount : 35)
  const totalMaxScore = evaluatedItems * 5
  const percentage = totalMaxScore > 0 ? (totalScoreObtained / totalMaxScore) * 100 : 0
  const roundedPct = Math.round(percentage * 100) / 100
  const averageScore = evaluatedItems > 0 ? Math.round((totalScoreObtained / evaluatedItems) * 100) / 100 : 0

  const greenMin = options?.greenMin ?? 4.0
  const yellowMin = options?.yellowMin ?? 2.0

  let gradeKey: EvaluationResult['gradeKey'] = 'URGENT_ACTION'
  let gradeLabel = options?.redLabel || 'ต้องปรับปรุงเร่งด่วน'
  let gradeColor: EvaluationResult['gradeColor'] = 'red'

  if (averageScore >= greenMin) {
    gradeKey = 'EXCELLENT'
    gradeLabel = options?.greenLabel || 'ดีเยี่ยม'
    gradeColor = 'emerald'
  } else if (averageScore >= yellowMin) {
    gradeKey = 'GOOD'
    gradeLabel = options?.yellowLabel || 'ปานกลาง'
    gradeColor = 'amber'
  } else {
    gradeKey = 'URGENT_ACTION'
    gradeLabel = options?.redLabel || 'ต้องปรับปรุงเร่งด่วน'
    gradeColor = 'red'
  }

  return {
    totalItems,
    evaluatedItems,
    naItems,
    totalScoreObtained,
    totalMaxScore,
    percentage: roundedPct,
    averageScore,
    gradeKey,
    gradeLabel,
    gradeColor,
  }
}
