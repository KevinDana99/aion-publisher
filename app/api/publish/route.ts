import { NextResponse } from 'next/server'
import { getFacebookAppConfig } from '@/lib/facebook/app-config'
import { getInstagramCredentials } from '@/lib/credentials/tokens'
import { FacebookPostService } from '@/lib/services/facebook'
import { InstagramMediaService } from '@/lib/services/instagram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, platforms, mediaFiles, scheduledDateTime } = body

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'Content and platforms are required' }, { status: 400 })
    }

    const results: Record<string, { success: boolean; postId?: string; error?: string }> = {}

    for (const platform of platforms) {
      try {
        if (platform === 'facebook') {
          const config = await getFacebookAppConfig()
          const accessToken = config.pageAccessToken

          if (!accessToken) {
            results[platform] = { success: false, error: 'Facebook not connected' }
            continue
          }

          const postService = new FacebookPostService(accessToken)
          const result = await postService.createPost('me', content)
          results[platform] = { success: true, postId: result.id }
        } 
        else if (platform === 'instagram') {
          const credentials = await getInstagramCredentials()
          const accessToken = credentials?.accessToken

          if (!accessToken) {
            results[platform] = { success: false, error: 'Instagram not connected' }
            continue
          }

          const mediaService = new InstagramMediaService(accessToken)
          
          if (mediaFiles && mediaFiles.length > 0) {
            const mediaId = await mediaService.createMediaContainer(
              mediaFiles[0].url,
              mediaFiles[0].type || 'IMAGE',
              content
            )
            const publishedResult = await mediaService.publishMediaContainer(mediaId.containerId)
            results[platform] = { success: true, postId: publishedResult.id }
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
