import { prisma } from './prisma'

export interface BuildingStaffInput {
  staffName: string
  userId?: string | null
  isPrimary?: boolean
  phone?: string | null
}

interface ExistingStaffLike {
  staffName: string
  userId: string | null
  isPrimary: boolean
  phone: string | null
}

function cleanStaffName(raw: string): string {
  return raw
    .replace(/\([^)]*\)/g, '')
    .replace(/^(นางสาว|นาง|นาย|ดร\.|ผศ\.|รศ\.)\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractUserLogin(raw: string): string | null {
  const match = raw.match(/\(([0-9A-Za-z_-]+)\)\s*$/)
  return match ? match[1].trim() : null
}

/**
 * Resolve BuildingStaff payload while preserving existing userId/isPrimary/phone
 * and auto-matching unlinked names against the User table.
 */
export async function resolveBuildingStaffData(
  input: { staffs?: BuildingStaffInput[]; staffNames?: string[] },
  existingStaffs: ExistingStaffLike[] = []
) {
  const rawItems: BuildingStaffInput[] = Array.isArray(input.staffs)
    ? input.staffs
        .map(s => ({
          staffName: (s.staffName || '').trim(),
          userId: s.userId ?? null,
          isPrimary: s.isPrimary,
          phone: s.phone ?? null
        }))
        .filter(s => s.staffName.length > 0)
    : (input.staffNames || [])
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(staffName => ({ staffName }))

  if (rawItems.length === 0) return []

  const existingByExactName = new Map<string, ExistingStaffLike>()
  const existingByCleanName = new Map<string, ExistingStaffLike>()
  for (const ex of existingStaffs) {
    existingByExactName.set(ex.staffName.trim(), ex)
    existingByCleanName.set(cleanStaffName(ex.staffName), ex)
  }

  const users = await prisma.user.findMany({
    select: { id: true, userlogin: true, fullName: true }
  })
  const userByLogin = new Map(users.map(u => [u.userlogin, u]))
  const userByCleanName = new Map(users.map(u => [cleanStaffName(u.fullName), u]))

  const resolved = rawItems.map((item) => {
    const cleaned = cleanStaffName(item.staffName)
    const loginHint = extractUserLogin(item.staffName)
    const existing = existingByExactName.get(item.staffName) || existingByCleanName.get(cleaned)

    const matchedUser =
      (loginHint ? userByLogin.get(loginHint) : undefined) ||
      userByCleanName.get(cleaned)

    const userId = item.userId ?? existing?.userId ?? matchedUser?.id ?? null
    const staffName = matchedUser && !existing ? matchedUser.fullName : item.staffName
    const isPrimary = item.isPrimary ?? existing?.isPrimary ?? false
    const phone = item.phone ?? existing?.phone ?? null

    return {
      staffName,
      userId,
      isPrimary,
      phone
    }
  })

  if (!resolved.some(r => r.isPrimary) && resolved.length > 0) {
    resolved[0].isPrimary = true
  }

  return resolved
}
