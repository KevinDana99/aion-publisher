import { NextResponse } from 'next/server'
import { getInstagramCredentials } from '@/lib/credentials/tokens'
import { InstagramPostService, InstagramCommentService } from '@/lib/services/instagram'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const mediaId = searchParams.get('mediaId')
    const limit = parseInt(searchParams.get('limit') || '25')

    const credentials = await getInstagramCredentials()
    const accessToken = credentials?.accessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Instagram access token not configured' }, { status: 401 })
    }

    const userId = credentials?.userId || 'me'

    if (action === 'media') {
      const postService = new InstagramPostService(accessToken)
      const media = await postService.getMedia(userId, limit)
      return NextResponse.json({ media })
    }

    if (action === 'insights' && mediaId) {
      const postService = new InstagramPostService(accessToken)
      const insights = await postService.getMediaInsights(mediaId)
      return NextResponse.json({ insights })
    }

    if (action === 'comments' && mediaId) {
      const commentService = new InstagramCommentService(accessToken)
      const comments = await commentService.getComments(mediaId, limit)
      return NextResponse.json({ comments })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Instagram API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, commentId, message, hide } = body

    const credentials = await getInstagramCredentials()
    const accessToken = credentials?.accessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Instagram access token not configured' }, { status: 401 })
    }

    if (action === 'replyComment' && commentId && message) {
      const commentService = new InstagramCommentService(accessToken)
      const result = await commentService.replyToComment(commentId, message)
      return NextResponse.json({ success: true, commentId: result.id })
    }

    if (action === 'deleteComment' && commentId) {
      const commentService = new InstagramCommentService(accessToken)
      await commentService.deleteComment(commentId)
      return NextResponse.json({ success: true })
    }

    if (action === 'hideComment' && commentId) {
      const commentService = new InstagramCommentService(accessToken)
      await commentService.hideComment(commentId, hide !== false)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Instagram API error:', error)
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 })
  }
}
