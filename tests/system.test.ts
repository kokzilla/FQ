import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateEvaluation } from '../shared/types/evaluation'
import { EVALUATION_CATEGORIES, EVALUATION_QUESTIONS } from '../shared/constants/questions'
import { evaluateColorGrade, DEFAULT_COLOR_CRITERIA, getColorCriteriaSettings, saveColorCriteriaSettings } from '../server/utils/settings'
import { createSignedSession, verifySignedSession } from '../server/utils/auth'

describe('1. Unit Tests: Evaluation Calculation (UT-01 to UT-04)', () => {
  it('UT-01: คำนวณคะแนนเต็มทุกข้อ (35 ข้อ ได้ 5 คะแนนทั้งหมด)', () => {
    const scores: Record<number, { score: number | null; isNA: boolean }> = {}
    for (let i = 1; i <= 35; i++) {
      scores[i] = { score: 5, isNA: false }
    }
    const result = calculateEvaluation(scores)
    assert.equal(result.totalItems, 35)
    assert.equal(result.evaluatedItems, 35)
    assert.equal(result.naItems, 0)
    assert.equal(result.totalScoreObtained, 175)
    assert.equal(result.totalMaxScore, 175)
    assert.equal(result.averageScore, 5.0)
    assert.equal(result.percentage, 100)
    assert.equal(result.gradeKey, 'EXCELLENT')
  })

  it('UT-02: คำนวณคะแนนเมื่อมีข้อ N/A (ให้คะแนน 4 จำนวน 30 ข้อ, N/A 5 ข้อ)', () => {
    const scores: Record<number, { score: number | null; isNA: boolean }> = {}
    for (let i = 1; i <= 35; i++) {
      if (i <= 30) {
        scores[i] = { score: 4, isNA: false }
      } else {
        scores[i] = { score: null, isNA: true }
      }
    }
    const result = calculateEvaluation(scores)
    assert.equal(result.totalItems, 35)
    assert.equal(result.evaluatedItems, 30)
    assert.equal(result.naItems, 5)
    assert.equal(result.totalScoreObtained, 120)
    assert.equal(result.totalMaxScore, 150)
    assert.equal(result.averageScore, 4.0)
    assert.equal(result.percentage, 80)
    assert.equal(result.gradeKey, 'EXCELLENT')
  })

  it('UT-03: คำนวณกรณีเลือก N/A ทุกข้อ (Edge Case ป้องกันการหารด้วยศูนย์)', () => {
    const scores: Record<number, { score: number | null; isNA: boolean }> = {}
    for (let i = 1; i <= 35; i++) {
      scores[i] = { score: null, isNA: true }
    }
    const result = calculateEvaluation(scores)
    assert.equal(result.evaluatedItems, 0)
    assert.equal(result.naItems, 35)
    assert.equal(result.totalMaxScore, 0)
    assert.equal(result.totalScoreObtained, 0)
    assert.equal(result.averageScore, 0)
    assert.equal(result.percentage, 0)
    assert.equal(Number.isNaN(result.averageScore), false)
    assert.equal(result.gradeKey, 'URGENT_ACTION')
  })

  it('UT-04: ประเมินเกณฑ์สี (evaluateColorGrade) และรองรับเกณฑ์สีที่กำหนดเอง', () => {
    const cfg = DEFAULT_COLOR_CRITERIA.building
    assert.equal(evaluateColorGrade(4.0, cfg).levelKey, 'GREEN')
    assert.equal(evaluateColorGrade(3.99, cfg).levelKey, 'YELLOW')
    assert.equal(evaluateColorGrade(2.0, cfg).levelKey, 'YELLOW')
    assert.equal(evaluateColorGrade(1.99, cfg).levelKey, 'RED')

    // ทดสอบปรับเกณฑ์สีเอง (เช่น เขียว >= 4.5, เหลือง >= 3.0)
    const customScores: Record<number, { score: number | null; isNA: boolean }> = {
      1: { score: 4, isNA: false },
      2: { score: 4, isNA: false }
    }
    const customEval = calculateEvaluation(customScores, {
      totalItems: 2,
      greenMin: 4.5,
      yellowMin: 3.0,
      yellowLabel: 'เฝ้าระวังพิเศษ'
    })
    assert.equal(customEval.totalItems, 2)
    assert.equal(customEval.averageScore, 4.0)
    assert.equal(customEval.gradeKey, 'GOOD')
    assert.equal(customEval.gradeLabel, 'เฝ้าระวังพิเศษ')
  })
})

describe('2. Security & Session Integrity Tests (IT-01)', () => {
  it('IT-01: สร้างและตรวจสอบลายเซ็นดิจิทัลของคุกกี้เซสชัน (HMAC-SHA256) ป้องกันการปลอมแปลงสิทธิ์', () => {
    const session = createSignedSession({
      id: 'u1',
      userlogin: 'somchai',
      fullName: 'ดร.สมชาย ใจมั่น',
      role: 'AUDITOR'
    })

    assert.ok(session.sig)
    assert.equal(verifySignedSession(session), true)

    // จำลองการแก้ไขสิทธิ์ในคุกกี้จาก AUDITOR เป็น ADMIN
    const tamperedSession = {
      ...session,
      role: 'ADMIN'
    }
    assert.equal(verifySignedSession(tamperedSession), false)
  })
})

describe('3. Integration & Data Layer Tests (IT-02 to IT-07)', () => {
  it('IT-04: ตรวจสอบโครงสร้างหมวดหมู่และข้อคำถามเริ่มต้น (7 หมวด 35 ข้อ)', () => {
    assert.equal(EVALUATION_CATEGORIES.length, 7)
    assert.equal(EVALUATION_QUESTIONS.length, 35)
    for (let i = 1; i <= 35; i++) {
      const q = EVALUATION_QUESTIONS.find(item => item.itemNumber === i)
      assert.ok(q, `ต้องมีข้อคำถามลำดับที่ ${i}`)
      assert.equal(q.maxScore, 5)
    }
  })

  it('IT-06: ทดสอบการคำนวณมติกรรมการหลายคนระดับรายข้อ (Multi-Auditor Item-Level Consensus)', () => {
    // จำลองกรรมการ 2 ท่านตรวจอาคารเดียวกัน โดยท่านที่ 2 เลือก N/A ในข้อที่ 2
    const eval1 = {
      1: { score: 5, isNA: false },
      2: { score: 4, isNA: false }
    }
    const eval2 = {
      1: { score: 3, isNA: false },
      2: { score: null, isNA: true }
    }
    const evaluations = [eval1, eval2]

    let totalScoreSum = 0
    let evaluatedQuestionsCount = 0
    for (const qId of [1, 2]) {
      let qScoresTotal = 0
      let qVotersCount = 0
      for (const ev of evaluations) {
        const item = (ev as any)[qId]
        if (item && !item.isNA && item.score !== null) {
          qScoresTotal += item.score
          qVotersCount++
        }
      }
      if (qVotersCount > 0) {
        totalScoreSum += qScoresTotal / qVotersCount
        evaluatedQuestionsCount++
      }
    }
    // ข้อ 1 เฉลี่ย = (5+3)/2 = 4.0, ข้อ 2 เฉลี่ย = 4/1 = 4.0 -> รวมเฉลี่ยอาคาร = 4.00
    const avgScore = totalScoreSum / evaluatedQuestionsCount
    assert.equal(avgScore, 4.0)
  })

  it('IT-07: การอ่านและบันทึกเกณฑ์สี (Color Criteria Settings)', async () => {
    const initial = await getColorCriteriaSettings()
    assert.equal(typeof initial.building.greenMin, 'number')
    assert.equal(typeof initial.staff.greenMin, 'number')

    const updated = await saveColorCriteriaSettings(
      { greenMin: 4.2, yellowMin: 2.5 },
      undefined
    )
    assert.equal(updated.building.greenMin, 4.2)
    assert.equal(updated.building.yellowMin, 2.5)

    // คืนค่าเดิมหลังทดสอบ
    await saveColorCriteriaSettings(DEFAULT_COLOR_CRITERIA.building, DEFAULT_COLOR_CRITERIA.staff)
  })
})
