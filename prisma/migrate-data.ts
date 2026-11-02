import { DatabaseSync } from 'node:sqlite'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const dbPath = resolve(process.cwd(), 'prisma/dev.db')

async function migrate() {
  if (!existsSync(dbPath)) {
    console.log('No SQLite dev.db found. Skipping SQLite data migration.')
    return
  }

  console.log('Connecting to SQLite dev.db...')
  const sqlite = new DatabaseSync(dbPath)

  function getAll<T = any>(table: string): T[] {
    try {
      return sqlite.prepare(`SELECT * FROM "${table}"`).all() as T[]
    } catch (e) {
      return []
    }
  }

  console.log('Migrating data from SQLite to PostgreSQL...')

  // 1. Categories
  const categories = getAll('Category')
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, order: c.order },
      create: { id: c.id, name: c.name, order: c.order }
    })
  }
  console.log(`✓ Migrated ${categories.length} Categories`)

  // 2. QuestionItems
  const questions = getAll('QuestionItem')
  for (const q of questions) {
    await prisma.questionItem.upsert({
      where: { id: q.id },
      update: {
        categoryId: q.categoryId,
        itemNumber: q.itemNumber,
        title: q.title,
        maxScore: q.maxScore
      },
      create: {
        id: q.id,
        categoryId: q.categoryId,
        itemNumber: q.itemNumber,
        title: q.title,
        maxScore: q.maxScore
      }
    })
  }
  console.log(`✓ Migrated ${questions.length} QuestionItems`)

  // 3. Users
  const users = getAll('User')
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        userlogin: u.userlogin,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        departmentId: u.departmentId,
        positionName: u.positionName,
        phone: u.phone
      },
      create: {
        id: u.id,
        userlogin: u.userlogin,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        departmentId: u.departmentId,
        positionName: u.positionName,
        phone: u.phone,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt)
      }
    })
  }
  console.log(`✓ Migrated ${users.length} Users`)

  // 4. EvaluationRounds
  const rounds = getAll('EvaluationRound')
  for (const r of rounds) {
    await prisma.evaluationRound.upsert({
      where: { id: r.id },
      update: {
        name: r.name,
        year: r.year,
        description: r.description,
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status
      },
      create: {
        id: r.id,
        name: r.name,
        year: r.year,
        description: r.description,
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt)
      }
    })
  }
  console.log(`✓ Migrated ${rounds.length} EvaluationRounds`)

  // 5. Buildings
  const buildings = getAll('Building')
  for (const b of buildings) {
    await prisma.building.upsert({
      where: { id: b.id },
      update: {
        code: b.code,
        name: b.name,
        floors: b.floors,
        description: b.description,
        isActive: Boolean(b.isActive)
      },
      create: {
        id: b.id,
        code: b.code,
        name: b.name,
        floors: b.floors,
        description: b.description,
        isActive: Boolean(b.isActive),
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt)
      }
    })
  }
  console.log(`✓ Migrated ${buildings.length} Buildings`)

  // 6. BuildingStaffs
  const staffs = getAll('BuildingStaff')
  for (const s of staffs) {
    await prisma.buildingStaff.upsert({
      where: { id: s.id },
      update: {
        buildingId: s.buildingId,
        userId: s.userId,
        staffName: s.staffName,
        phone: s.phone,
        isPrimary: Boolean(s.isPrimary)
      },
      create: {
        id: s.id,
        buildingId: s.buildingId,
        userId: s.userId,
        staffName: s.staffName,
        phone: s.phone,
        isPrimary: Boolean(s.isPrimary),
        createdAt: new Date(s.createdAt)
      }
    })
  }
  console.log(`✓ Migrated ${staffs.length} BuildingStaffs`)

  // 7. SystemSettings
  const settings = getAll('SystemSetting')
  for (const set of settings) {
    await prisma.systemSetting.upsert({
      where: { key: set.key },
      update: {
        value: set.value
      },
      create: {
        key: set.key,
        value: set.value,
        updatedAt: new Date(set.updatedAt)
      }
    })
  }
  console.log(`✓ Migrated ${settings.length} SystemSettings`)

  // 8. Assessments
  const assessments = getAll('Assessment')
  for (const a of assessments) {
    await prisma.assessment.upsert({
      where: { id: a.id },
      update: {
        roundId: a.roundId,
        buildingId: a.buildingId,
        staffId: a.staffId,
        assessorId: a.assessorId,
        responsibleStaffText: a.responsibleStaffText,
        assessedAt: new Date(a.assessedAt),
        totalScoreObtained: a.totalScoreObtained,
        totalMaxScore: a.totalMaxScore,
        percentage: a.percentage,
        grade: a.grade,
        strengthsSummary: a.strengthsSummary,
        urgentProblems: a.urgentProblems,
        correctivePlan: a.correctivePlan,
        targetDeadline: a.targetDeadline ? new Date(a.targetDeadline) : null,
        followUpResult: a.followUpResult,
        isFollowedUp: Boolean(a.isFollowedUp),
        followedUpAt: a.followedUpAt ? new Date(a.followedUpAt) : null,
        signatureImage: a.signatureImage
      },
      create: {
        id: a.id,
        roundId: a.roundId,
        buildingId: a.buildingId,
        staffId: a.staffId,
        assessorId: a.assessorId,
        responsibleStaffText: a.responsibleStaffText,
        assessedAt: new Date(a.assessedAt),
        totalScoreObtained: a.totalScoreObtained,
        totalMaxScore: a.totalMaxScore,
        percentage: a.percentage,
        grade: a.grade,
        strengthsSummary: a.strengthsSummary,
        urgentProblems: a.urgentProblems,
        correctivePlan: a.correctivePlan,
        targetDeadline: a.targetDeadline ? new Date(a.targetDeadline) : null,
        followUpResult: a.followUpResult,
        isFollowedUp: Boolean(a.isFollowedUp),
        followedUpAt: a.followedUpAt ? new Date(a.followedUpAt) : null,
        signatureImage: a.signatureImage,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt)
      }
    })
  }
  console.log(`✓ Migrated ${assessments.length} Assessments`)

  // 9. ScoreItems
  const scores = getAll('ScoreItem')
  for (const s of scores) {
    await prisma.scoreItem.upsert({
      where: {
        assessmentId_questionItemId: {
          assessmentId: s.assessmentId,
          questionItemId: s.questionItemId
        }
      },
      update: {
        score: s.score,
        isNA: Boolean(s.isNA),
        defectNote: s.defectNote,
        photoUrl: s.photoUrl
      },
      create: {
        id: s.id,
        assessmentId: s.assessmentId,
        questionItemId: s.questionItemId,
        score: s.score,
        isNA: Boolean(s.isNA),
        defectNote: s.defectNote,
        photoUrl: s.photoUrl
      }
    })
  }
  console.log(`✓ Migrated ${scores.length} ScoreItems`)

  // 10. FindingAttachments
  const attachments = getAll('FindingAttachment')
  for (const att of attachments) {
    await prisma.findingAttachment.upsert({
      where: { id: att.id },
      update: {
        assessmentId: att.assessmentId,
        type: att.type,
        fileUrl: att.fileUrl,
        caption: att.caption
      },
      create: {
        id: att.id,
        assessmentId: att.assessmentId,
        type: att.type,
        fileUrl: att.fileUrl,
        caption: att.caption,
        createdAt: new Date(att.createdAt)
      }
    })
  }
  console.log(`✓ Migrated ${attachments.length} FindingAttachments`)

  console.log('Data migration completed successfully!')
}

migrate()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
