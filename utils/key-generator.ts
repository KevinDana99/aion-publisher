export function generateRandomToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }
  return result
}

export function generateSecureVerifyToken(): string {
  return generateRandomToken(48)
}

export function generateApiKey(): string {
  return `key_${generateRandomToken(40)}`
}
