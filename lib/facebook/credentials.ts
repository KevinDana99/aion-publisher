interface FacebookCredentials {
  accessToken: string
  pageId: string
  pageName: string
  expiresAt?: number
}

const STORAGE_KEY = 'facebook-credentials'

export function saveCredentials(credentials: FacebookCredentials): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
  }
}

export function getCredentials(): FacebookCredentials | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}