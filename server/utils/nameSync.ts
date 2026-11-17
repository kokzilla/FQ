import type { BuildingAuditorsMap } from './settings'

/**
 * Replaces an exact staff name inside a comma-separated `responsibleStaffText` string
 * (e.g. "นางสาว ก, นางสาว ข") without corrupting partial substring matches.
 * Returns the updated string and whether any replacement occurred.
 */
export function replaceStaffNameInText(
  text: string | null | undefined,
  oldName: string,
  newName: string
): { updated: string; changed: boolean } {
  if (!text || !oldName.trim() || !newName.trim() || oldName.trim() === newName.trim()) {
    return { updated: text || '', changed: false }
  }

  const targetOld = oldName.trim()
  const targetNew = newName.trim()
  const parts = text.split(',').map(p => p.trim()).filter(Boolean)

  let changed = false
  const nextParts = parts.map((part) => {
    if (part === targetOld) {
      changed = true
      return targetNew
    }
    return part
  })

  if (!changed) {
    return { updated: text, changed: false }
  }

  // Deduplicate if renaming caused identical adjacent/duplicate entries in the same record
  const uniqueParts: string[] = []
  const seen = new Set<string>()
  for (const p of nextParts) {
    if (!seen.has(p)) {
      seen.add(p)
      uniqueParts.push(p)
    }
  }

  return { updated: uniqueParts.join(', '), changed: true }
}

/**
 * Updates matching auditor entries across all buildings in a `BuildingAuditorsMap`
 * when a user's `fullName` or `userlogin` changes.
 */
export function syncAuditorInMap(
  map: BuildingAuditorsMap,
  match: { userId?: string; oldUserlogin?: string; oldFullName?: string },
  next: { userlogin: string; fullName: string }
): { updatedMap: BuildingAuditorsMap; changed: boolean } {
  let changed = false
  const updatedMap: BuildingAuditorsMap = {}

  for (const [buildingId, list] of Object.entries(map || {})) {
    if (!Array.isArray(list)) {
      updatedMap[buildingId] = []
      continue
    }

    updatedMap[buildingId] = list.map((aud) => {
      const isMatch =
        (match.userId && aud.userId === match.userId) ||
        (match.oldUserlogin && aud.userlogin === match.oldUserlogin) ||
        (match.oldFullName && aud.fullName === match.oldFullName)

      if (isMatch && (aud.fullName !== next.fullName || aud.userlogin !== next.userlogin)) {
        changed = true
        return {
          ...aud,
          userlogin: next.userlogin,
          fullName: next.fullName
        }
      }
      return aud
    })
  }

  return { updatedMap, changed }
}
