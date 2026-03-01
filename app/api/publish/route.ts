import { NextResponse } from 'next/server'
import { getFacebookAppConfig } from '@/lib/facebook/app-config'
import { getInstagramCredentials } from '@/lib/credentials/tokens'
import { FacebookPostService } from '@/lib/services/facebook'
import { InstagramMediaService } from '@/lib/services/instagram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, platforms, mediaUrls, scheduledDateTime, type = 'post' } = body

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'At least one platform is required' }, { status: 400 })
    }

    if (scheduledDateTime) {
      return NextResponse.json({
        success: false,
        error: 'Scheduled posts are saved but not yet auto-published. This feature is coming soon.'
      }, { status: 200 })
    }

    const results: Record<string, { success: boolean; postId?: string; error?: string }> = {}

    const instagramCreds = await getInstagramCredentials()
    const instagramToken = instagramCreds?.accessToken
    
    const facebookConfig = await getFacebookAppConfig()
    const facebookToken = facebookConfig?.pageAccessToken

    for (const platform of platforms) {
      try {
        if (platform === 'facebook') {
          if (!facebookToken) {
            results[platform] = { success: false, error: 'Facebook not connected' }
            continue
          }

          const postService = new FacebookPostService(facebookToken)
          
          if (mediaUrls && mediaUrls.length > 0) {
            const mediaId = await postService.createMedia(mediaUrls[0])
            const result = await postService.createPost('me', content, mediaId)
            results[platform] = { success: true, postId: result.id }
          } else {
            const result = await postService.createPost('me', content)
            results[platform] = { success: true, postId: result.id }
          }
        } 
        else if (platform === 'instagram') {
          if (!instagramToken) {
            results[platform] = { success: false, error: 'Instagram not connected' }
            continue
          }

          const mediaService = new InstagramMediaService(instagramToken)
          
          if (type === 'reel' || (mediaUrls && mediaUrls.length > 0)) {
            const mediaUrl = mediaUrls?.[0]
            if (!mediaUrl) {
              results[platform] = { success: false, error: 'Video URL is required for Reels' }
              continue
            }

            if (type === 'reel' || mediaUrl.includes('video') || mediaUrl.endsWith('.mp4')) {
              const result = await mediaService.createReel(mediaUrl, content)
              results[platform] = { success: true, postId: result.id }
            } else {
              const container = await mediaService.createMediaContainer(mediaUrl, 'IMAGE', content)
              const published = await mediaService.publishMediaContainer(container.containerId)
              results[platform] = { success: true, postId: published.id }
            }
          } else {
            results[platform] = { success: false, error: 'Instagram requires media for posts' }
          }
        }
        else if (platform === 'linkedin') {
          results[platform] = { success: false, error: 'LinkedIn integration not yet implemented' }
        }
        else if (platform === 'twitter') {
          results[platform] = { success: false, error: 'Twitter integration not yet implemented' }
        }
      } catch (error: any) {
        console.error(`Error publishing to ${platform}:`, error)
        results[platform] = { success: false, error: error.message || 'Unknown error' }
      }
    }

    const allSuccess = Object.values(results).every(r => r.success)
    return NextResponse.json({
      success: allSuccess,
      results,
      scheduled: scheduledDateTime ? true : false,
      scheduledDateTime
    })

  } catch (error: any) {
    console.error('Publish API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to publish' }, { status: 500 })
  }
}
