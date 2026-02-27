let verifyToken = ''

export function setVerifyToken(token: string) {
  verifyToken = token
}

export function getVerifyToken(): string {
  return verifyToken
}

export function getClientId(): string {
  return process.env.INSTAGRAM_CLIENT_ID || ''
}

export function getClientSecret(): string {
  return process.env.INSTAGRAM_CLIENT_SECRET || ''
}

export function getRedirectUri(): string {
  return process.env.INSTAGRAM_REDIRECT_URI || ''
}