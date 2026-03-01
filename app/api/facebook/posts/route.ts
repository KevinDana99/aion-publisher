import { NextResponse } from 'next/server'
import { getFacebookAppConfig } from '@/lib/facebook/app-config'
import { FacebookPostService, FacebookCommentService } from '@/lib/services/facebook'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const postId = searchParams.get('postId')
    const limit = parseInt(searchParams.get('limit') || '25')

    const config = await getFacebookAppConfig()
    const accessToken = config.pageAccessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Facebook access token not configured' }, { status: 401 })
    }

    const pageId = 'me'

    if (action === 'posts') {
      const postService = new FacebookPostService(accessToken)
      const posts = await postService.getPosts(pageId, limit)
      return NextResponse.json({ posts })
    }

    if (action === 'post' && postId) {
      const postService = new FacebookPostService(accessToken)
      const post = await postService.getPost(postId)
      return NextResponse.json({ post })
    }

    if (action === 'comments' && postId) {
      const commentService = new FacebookCommentService(accessToken)
      const comments = await commentService.getComments(postId, limit)
      return NextResponse.json({ comments })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Facebook API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, postId, commentId, message } = body

    const config = await getFacebookAppConfig()
    const accessToken = config.pageAccessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Facebook access token not configured' }, { status: 401 })
    }

    const pageId = 'me'

    if (action === 'createPost') {
      const postService = new FacebookPostService(accessToken)
      const result = await postService.createPost(pageId, body.message, body.attachedMediaId)
      return NextResponse.json({ success: true, postId: result.id })
    }

    if (action === 'deletePost' && postId) {
      const postService = new FacebookPostService(accessToken)
      await postService.deletePost(postId)
      return NextResponse.json({ success: true })
    }

    if (action === 'replyComment' && commentId && message) {
      const commentService = new FacebookCommentService(accessToken)
      const result = await commentService.replyToComment(commentId, message)
      return NextResponse.json({ success: true, commentId: result.id })
    }

    if (action === 'deleteComment' && commentId) {
      const commentService = new FacebookCommentService(accessToken)
      await commentService.deleteComment(commentId)
      return NextResponse.json({ success: true })
    }

    if (action === 'hideComment' && commentId) {
      const commentService = new FacebookCommentService(accessToken)
      await commentService.hideComment(commentId, body.hide)
      return NextResponse.json({ success: true })
    }

    if (action === 'likeComment' && commentId) {
      const commentService = new FacebookCommentService(accessToken)
      await commentService.likeComment(commentId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Facebook API error:', error)
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 })
  }
}
