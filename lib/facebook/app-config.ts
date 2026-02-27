export function getAppId(): string {
  return process.env.FACEBOOK_APP_ID || ''
}

export function getAppSecret(): string {
  return process.env.FACEBOOK_APP_SECRET || ''
}

export function getVerifyToken(): string {
  return process.env.FACEBOOK_VERIFY_TOKEN || ''
}

export function getRedirectUri(): string {
  return process.env.FACEBOOK_REDIRECT_URI || ''
}
