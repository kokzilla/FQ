import { prisma } from './prisma'

let isReady: boolean | null = null
let lastChecked = 0
let lastError = ''
const SUCCESS_CACHE_MS = 15000 // หากเชื่อมต่อได้แล้ว จำสถานะไว้ 15 วินาที
const FAILURE_CACHE_MS = 5000  // หากเชื่อมต่อไม่ได้ จำไว้ 5 วินาที

export class DatabaseError extends Error {
  statusCode: number
  statusMessage: string
  constructor(message = 'ไม่สามารถเชื่อมต่อฐานข้อมูล PostgreSQL บนเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อเครือข่าย') {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = 503
    this.statusMessage = 'Service Unavailable'
  }
}

/**
 * ตรวจสอบความพร้อมของฐานข้อมูล PostgreSQL
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
    lastError = ''
    return true
  } catch (error: any) {
    isReady = false
    lastChecked = now
    lastError = error?.message || 'Cannot connect to database'
    return false
  }
}

/**
 * ตรวจสอบสถานะการเชื่อมต่อพร้อมข้อความ Error (สำหรับ Health Check)
 */
export async function checkDbConnection(): Promise<{ ok: boolean; message: string; error?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`
    isReady = true
    lastChecked = Date.now()
    lastError = ''
    return { ok: true, message: 'เชื่อมต่อฐานข้อมูล PostgreSQL สำเร็จ' }
  } catch (error: any) {
    isReady = false
    lastChecked = Date.now()
    lastError = error?.message || 'Cannot connect to database'
    return {
      ok: false,
      message: 'ไม่สามารถเชื่อมต่อฐานข้อมูล PostgreSQL บนเซิร์ฟเวอร์ได้',
      error: lastError
    }
  }
}

/**
 * บังคับว่าต้องมีฐานข้อมูลเท่านั้น หากไม่มีจะ throw Error 503 ทันที (ตัด In-Memory ทิ้ง)
 */
export async function requireDatabase() {
  const ready = await isDbReady()
  if (!ready) {
    if (typeof (globalThis as any).createError === 'function') {
      throw (globalThis as any).createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message: 'ไม่สามารถเชื่อมต่อฐานข้อมูล PostgreSQL บนเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อเครือข่าย'
      })
    }
    throw new DatabaseError()
  }
}
