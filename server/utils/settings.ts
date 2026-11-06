import { prisma } from './prisma'
import { isDbReady, requireDatabase } from './dbState'

export interface ColorThresholdConfig {
  greenMin: number
  yellowMin: number
  greenLabel: string
  yellowLabel: string
  redLabel: string
}

export interface ColorCriteriaSettings {
  building: ColorThresholdConfig
  staff: ColorThresholdConfig
}

export const DEFAULT_COLOR_CRITERIA: ColorCriteriaSettings = {
  building: {
    greenMin: 4.0,
    yellowMin: 2.0,
    greenLabel: 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน',
    yellowLabel: 'ปานกลาง / เฝ้าระวัง',
    redLabel: 'ต้องปรับปรุงเร่งด่วน'
  },
  staff: {
    greenMin: 4.0,
    yellowMin: 2.0,
    greenLabel: 'ดีเยี่ยม / ผลงานดีเด่น',
    yellowLabel: 'ปานกลาง / พอใช้',
    redLabel: 'ต้องปรับปรุงเร่งด่วน'
  }
}

export async function getColorCriteriaSettings(): Promise<ColorCriteriaSettings> {
  const ready = await isDbReady()
  if (!ready) {
    return JSON.parse(JSON.stringify(DEFAULT_COLOR_CRITERIA))
  }

  try {
    const records = await (prisma as any).systemSetting.findMany({
      where: {
        key: {
          in: ['criteria_building', 'criteria_staff']
        }
      }
    })

    const result: ColorCriteriaSettings = JSON.parse(JSON.stringify(DEFAULT_COLOR_CRITERIA))

    for (const rec of records) {
      if (rec.key === 'criteria_building') {
        try {
          result.building = { ...DEFAULT_COLOR_CRITERIA.building, ...JSON.parse(rec.value) }
        } catch (e) {}
      } else if (rec.key === 'criteria_staff') {
        try {
          result.staff = { ...DEFAULT_COLOR_CRITERIA.staff, ...JSON.parse(rec.value) }
        } catch (e) {}
      }
    }

    return result
  } catch (err) {
    console.error('Error fetching settings from DB:', err)
    return JSON.parse(JSON.stringify(DEFAULT_COLOR_CRITERIA))
  }
}

export async function saveColorCriteriaSettings(
  buildingCriteria?: Partial<ColorThresholdConfig>,
  staffCriteria?: Partial<ColorThresholdConfig>
): Promise<ColorCriteriaSettings> {
  await requireDatabase()

  const current = await getColorCriteriaSettings()

  if (buildingCriteria) {
    current.building = {
      ...current.building,
      ...buildingCriteria,
      greenMin: Number(buildingCriteria.greenMin ?? current.building.greenMin),
      yellowMin: Number(buildingCriteria.yellowMin ?? current.building.yellowMin)
    }
  }

  if (staffCriteria) {
    current.staff = {
      ...current.staff,
      ...staffCriteria,
      greenMin: Number(staffCriteria.greenMin ?? current.staff.greenMin),
      yellowMin: Number(staffCriteria.yellowMin ?? current.staff.yellowMin)
    }
  }

  if (buildingCriteria) {
    await (prisma as any).systemSetting.upsert({
      where: { key: 'criteria_building' },
      update: { value: JSON.stringify(current.building) },
      create: { key: 'criteria_building', value: JSON.stringify(current.building) }
    })
  }
  if (staffCriteria) {
    await (prisma as any).systemSetting.upsert({
      where: { key: 'criteria_staff' },
      update: { value: JSON.stringify(current.staff) },
      create: { key: 'criteria_staff', value: JSON.stringify(current.staff) }
    })
  }

  return current
}

export function evaluateColorGrade(
  score: number,
  config: ColorThresholdConfig
): {
  gradeColor: 'emerald' | 'amber' | 'rose'
  gradeLabel: string
  levelKey: 'GREEN' | 'YELLOW' | 'RED'
} {
  const rounded = Math.round(score * 100) / 100
  if (rounded >= config.greenMin) {
    return {
      gradeColor: 'emerald',
      gradeLabel: config.greenLabel || 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน',
      levelKey: 'GREEN'
    }
  } else if (rounded >= config.yellowMin) {
    return {
      gradeColor: 'amber',
      gradeLabel: config.yellowLabel || 'ปานกลาง / เฝ้าระวัง',
      levelKey: 'YELLOW'
    }
  } else {
    return {
      gradeColor: 'rose',
      gradeLabel: config.redLabel || 'ต้องปรับปรุงเร่งด่วน',
      levelKey: 'RED'
    }
  }
}
