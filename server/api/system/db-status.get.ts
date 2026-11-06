import { defineEventHandler } from 'h3'
import { checkDbConnection } from '../../utils/dbState'

export default defineEventHandler(async () => {
  const status = await checkDbConnection()
  return status
})
