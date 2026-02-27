export function getClientId(): string {
  return process.env.INSTAGRAM_CLIENT_ID || ''
}

export function getClientSecret(): string {
  return process.env.INSTAGRAM_CLIENT_SECRET || ''
}

export function getVerifyToken(): string {
  return process.env.INSTAGRAM_VERIFY_TOKEN || ''
}

export function getRedirectUri(): string {
  return process.env.INSTAGRAM_REDIRECT_URI || ''
}
