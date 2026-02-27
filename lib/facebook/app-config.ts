let verifyToken = ''

export function setVerifyToken(token: string) {
  verifyToken = token
}

export function getVerifyToken(): string {
  return verifyToken
}

export function getAppId(): string {
  return process.env.FACEBOOK_APP_ID || ''
}

export function getAppSecret(): string {
  return process.env.FACEBOOK_APP_SECRET || ''
}

export function getRedirectUri(): string {
  return process.env.FACEBOOK_REDIRECT_URI || ''
}