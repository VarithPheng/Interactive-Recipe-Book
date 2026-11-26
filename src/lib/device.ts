// Anonymous id for this browser, used so each device gets one rating per recipe.
const KEY = 'recipebook:device-id'

export function getDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(KEY)
    if (existing && existing.length >= 8) return existing
    const id = crypto.randomUUID()
    window.localStorage.setItem(KEY, id)
    return id
  } catch {
    // Storage blocked: rating still works for this visit.
    return crypto.randomUUID()
  }
}
