import { defineEventHandler, getQuery } from 'h3'

const MOCK_BRU_USERS = [
  { userlogin: 'chartwut', fullName: 'อ.ชาติวุฒิ ธนาพรสิทธิ์', positionName: 'อาจารย์/นักวิชาการคอมพิวเตอร์', departmentId: '101', email: 'chartwut@bru.ac.th' },
  { userlogin: 'somchai', fullName: 'ดร.สมชาย ใจมั่น', positionName: 'ประธานกรรมการตรวจประเมินอาคาร', departmentId: '102', email: 'somchai@bru.ac.th' },
  { userlogin: 'nattapong', fullName: 'ผศ.ณัฐพงษ์ สิทธิศักดิ์', positionName: 'กรรมการตรวจประเมิน', departmentId: '103', email: 'nattapong@bru.ac.th' },
  { userlogin: 'pranee', fullName: 'นางปราณี ขยันยิ่ง', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)', departmentId: '201', email: 'pranee@bru.ac.th' },
  { userlogin: 'somjai', fullName: 'นางสมใจ รักษ์ดี', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)', departmentId: '201', email: 'somjai@bru.ac.th' },
  { userlogin: 'wandi', fullName: 'นางวันดี มีสุข', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)', departmentId: '201', email: 'wandi@bru.ac.th' },
  { userlogin: 'supaporn', fullName: 'นางสุภาพรรณ บัวแก้ว', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)', departmentId: '201', email: 'supaporn@bru.ac.th' },
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = String(query.search || '').trim()

  const config = useRuntimeConfig()
  const apiKey = config.bruSsoApiKey || process.env.BRU_SSO_API_KEY
  const baseUrl = config.bruSsoBaseUrl || process.env.BRU_SSO_BASE_URL || 'https://sso.bru.ac.th'

  if (apiKey) {
    try {
      const url = keyword
        ? `${baseUrl}/api/users?search=${encodeURIComponent(keyword)}&limit=30`
        : `${baseUrl}/api/users?limit=30`

      const res: any = await $fetch(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      })

      if (res?.data && Array.isArray(res.data)) {
        const normalized = res.data.map((u: any) => ({
          userlogin: u.userlogin || u.USERLOGIN || '',
          fullName: u.full_name || u.FULL_NAME || u.name || u.userlogin,
          positionName: u.position_name || u.POSITIONNAME || u.position || 'บุคลากรมหาวิทยาลัย',
          departmentId: u.departmentid || u.DEPARTMENTID || '',
          email: u.email || (u.userlogin ? `${u.userlogin}@bru.ac.th` : ''),
          staffId: u.staff_id || u.STAFF_ID || null,
        }))
        return { ok: true, data: normalized, source: 'BRU_SSO_API' }
      }
    } catch (err: any) {
      console.warn('BRU SSO API search error:', err?.message || err)
    }
  }

  // Fallback personnel search
  const lowerKeyword = keyword.toLowerCase()
  const filtered = lowerKeyword
    ? MOCK_BRU_USERS.filter(u => u.fullName.toLowerCase().includes(lowerKeyword) || u.userlogin.toLowerCase().includes(lowerKeyword))
    : MOCK_BRU_USERS

  return { ok: true, data: filtered, source: 'MOCK' }
})
