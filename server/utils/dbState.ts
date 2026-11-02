import { prisma } from './prisma'

let isReady: boolean | null = null
let lastChecked = 0
const SUCCESS_CACHE_MS = 60000 // หากเชื่อมต่อได้แล้ว จำสถานะไว้ 60 วินาที
const FAILURE_CACHE_MS = 10000 // หากเชื่อมต่อไม่ได้ ให้จำไว้ 10 วินาทีเพื่อไม่ให้หน้าเว็บค้างรอ Timeout ทุกครั้ง

/**
 * ตรวจสอบความพร้อมของฐานข้อมูล PostgreSQL
 * มีระบบ Cache ทั้งกรณีสำเร็จและล้มเหลว เพื่อป้องกัน UI หน่วงจาก Connection Timeout
 */
export async function isDbReady(): Promise<boolean> {
  const now = Date.now()

  if (isReady === true && now - lastChecked < SUCCESS_CACHE_MS) {
    return true
  }
  if (isReady === false && now - lastChecked < FAILURE_CACHE_MS) {
    return false
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    isReady = true
    lastChecked = now
    return true
  } catch (error) {
    isReady = false
    lastChecked = now
    return false
  }
}
