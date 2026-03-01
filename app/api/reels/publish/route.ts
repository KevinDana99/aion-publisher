import { NextResponse } from 'next/server'
import { getInstagramCredentials } from '@/lib/credentials/tokens'
import { InstagramMediaService } from '@/lib/services/instagram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caption, platforms, videoUrl } = body

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required. Please provide a publicly accessible URL to your video.' }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'At least one platform is required' }, { status: 400 })
    }

    const credentials = await getInstagramCredentials()
    const accessToken = credentials?.accessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Instagram not connected. Please configure credentials in Settings > Integrations.' }, { status: 401 })
    }

    const results: Record<string, { success: boolean; postId?: string; error?: string }> = {}

    for (const platform of platforms) {
      try {
        if (platform === 'instagram') {
          const mediaService = new InstagramMediaService(accessToken)
          const result = await mediaService.createReel(videoUrl, caption)
          results[platform] = { success: true, postId: result.id }
        } 
        else if (platform === 'facebook') {
          results[platform] = { success: false, error: 'Facebook video posts coming soon' }
        }
        else if (platform === 'tiktok') {
          results[platform] = { success: false, error: 'TikTok integration not yet implemented' }
        }
      } catch (error: any) {
        console.error(`Error publishing reel to ${platform}:`, error)
        results[platform] = { success: false, error: error.message || 'Unknown error' }
      }
    }

    const allSuccess = Object.values(results).every(r => r.success)
    return NextResponse.json({
      success: allSuccess,
      results
    })

  } catch (error: any) {
    console.error('Reels API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to publish reel' }, { status: 500 })
  }
}
