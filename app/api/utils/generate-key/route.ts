import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

const PLATFORMS = {
  instagram: 'instagram-private.key',
  facebook: 'facebook-private.key',
  whatsapp: 'whatsapp-private.key'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform } = body

    if (!platform || !PLATFORMS[platform as keyof typeof PLATFORMS]) {
      return NextResponse.json(
        { error: 'Invalid platform. Use: instagram, facebook, or whatsapp' },
        { status: 400 }
      )
    }

    const keyPath = path.join(DATA_DIR, PLATFORMS[platform as keyof typeof PLATFORMS])

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    execSync(`openssl genrsa -out "${keyPath}" 4096`, { encoding: 'utf-8' })

    return NextResponse.json({
      success: true,
      platform,
      keyPath,
      message: `Private key generated for ${platform}`
    })
  } catch (error: any) {
    console.error('Error generating private key:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate private key' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const keys: Record<string, { exists: boolean; path: string }> = {}

  for (const [platform, filename] of Object.entries(PLATFORMS)) {
    const keyPath = path.join(DATA_DIR, filename)
    keys[platform] = {
      exists: fs.existsSync(keyPath),
      path: keyPath
    }
  }

  return NextResponse.json({ keys })
}
