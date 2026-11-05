import { defineEventHandler, readBody } from 'h3'
import { saveColorCriteriaSettings } from '../../utils/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { building, staff } = body || {}

  const updated = await saveColorCriteriaSettings(building, staff)

  return {
    success: true,
    message: 'บันทึกเกณฑ์สีเรียบร้อยแล้ว',
    data: updated
  }
})
