interface InstagramCredentials {
  accessToken: string
  userId: string
  username: string
  expiresAt?: number
}

const STORAGE_KEY = 'instagram-credentials'

export function saveCredentials(credentials: InstagramCredentials): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
  }
}

export function getCredentials(): InstagramCredentials | null {
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