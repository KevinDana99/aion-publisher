'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Post {
  id: string
  platform: 'instagram' | 'facebook'
  content: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  permalink?: string
  createdAt: string
  likes?: number
  comments?: number
  shares?: number
  saves?: number
  reach?: number
}

export interface Comment {
  id: string
  postId: string
  platform: 'instagram' | 'facebook'
  userId: string
  username: string
  userProfilePic?: string
  text: string
  createdAt: string
  likes?: number
  isHidden?: boolean
}

export function useInstagramPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/instagram/posts?action=media&limit=25')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      const formattedPosts: Post[] = (data.media || []).map((media: any) => ({
        id: media.id,
        platform: 'instagram' as const,
        content: media.caption || '',
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType === 'VIDEO' ? 'video' as const : 'image' as const,
        permalink: media.permalink,
        createdAt: media.timestamp,
        likes: media.likeCount,
        comments: media.commentsCount,
        saves: media.saveCount,
        shares: media.shareCount
      }))

      setPosts(formattedPosts)
    } catch (e) {
      setError('Failed to fetch posts')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  return { posts, loading, error, fetchPosts }
}

export function useInstagramComments(mediaId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mediaId) {
      setComments([])
      return
    }

    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/instagram/posts?action=comments&mediaId=${mediaId}&limit=50`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          return
        }

        const formattedComments: Comment[] = (data.comments || []).map((comment: any) => ({
          id: comment.id,
          postId: mediaId,
          platform: 'instagram' as const,
          userId: comment.user.id,
          username: comment.user.username,
          userProfilePic: comment.user.profilePictureUrl,
          text: comment.text,
          createdAt: comment.timestamp,
          likes: comment.likeCount
        }))

        setComments(formattedComments)
      } catch (e) {
        setError('Failed to fetch comments')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [mediaId])

  const replyToComment = async (commentId: string, message: string) => {
    const response = await fetch('/api/instagram/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'replyComment', commentId, message })
    })
    return response.json()
  }

  const deleteComment = async (commentId: string) => {
    const response = await fetch('/api/instagram/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteComment', commentId })
    })
    return response.json()
  }

  const hideComment = async (commentId: string, hide: boolean = true) => {
    const response = await fetch('/api/instagram/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hideComment', commentId, hide })
    })
    return response.json()
  }

  return { comments, loading, error, replyToComment, deleteComment, hideComment }
}

export function useFacebookPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/facebook/posts?action=posts&limit=25')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      const formattedPosts: Post[] = (data.posts || []).map((post: any) => ({
        id: post.id,
        platform: 'facebook' as const,
        content: post.message || '',
        mediaUrl: post.fullPicture,
        permalink: post.permalink,
        createdAt: post.createdTime
      }))

      setPosts(formattedPosts)
    } catch (e) {
      setError('Failed to fetch posts')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  return { posts, loading, error, fetchPosts }
}

export function useFacebookComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) {
      setComments([])
      return
    }

    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/facebook/posts?action=comments&postId=${postId}&limit=50`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          return
        }

        const formattedComments: Comment[] = (data.comments || []).map((comment: any) => ({
          id: comment.id,
          postId: postId,
          platform: 'facebook' as const,
          userId: comment.from?.id || '',
          username: comment.from?.name || 'Unknown',
          text: comment.message,
          createdAt: comment.createdTime,
          likes: comment.likeCount
        }))

        setComments(formattedComments)
      } catch (e) {
        setError('Failed to fetch comments')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  const replyToComment = async (commentId: string, message: string) => {
    const response = await fetch('/api/facebook/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'replyComment', commentId, message })
    })
    return response.json()
  }

  const deleteComment = async (commentId: string) => {
    const response = await fetch('/api/facebook/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteComment', commentId })
    })
    return response.json()
  }

  const hideComment = async (commentId: string, hide: boolean = true) => {
    const response = await fetch('/api/facebook/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hideComment', commentId, hide })
    })
    return response.json()
  }

  const likeComment = async (commentId: string) => {
    const response = await fetch('/api/facebook/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'likeComment', commentId })
    })
    return response.json()
  }

  return { comments, loading, error, replyToComment, deleteComment, hideComment, likeComment }
}
