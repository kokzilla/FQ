import { defineEventHandler } from 'h3'
import { getColorCriteriaSettings } from '../../utils/settings'

export default defineEventHandler(async () => {
  const settings = await getColorCriteriaSettings()
  return {
    success: true,
    data: settings
  }
})
