import { InstagramAPI } from '../../instagram/api'

export class InstagramMediaService {
  private api: InstagramAPI

  constructor(accessToken?: string) {
    this.api = new InstagramAPI(accessToken)
  }

  setAccessToken(token: string) {
    this.api.setAccessToken(token)
  }

  async createMediaContainer(
    imageUrl: string,
    mediaType: 'IMAGE' | 'VIDEO' = 'IMAGE',
    caption?: string
  ) {
    return this.api.createMediaContainer(imageUrl, mediaType, caption)
  }

  async publishMediaContainer(containerId: string) {
    return this.api.publishMediaContainer(containerId)
  }

  async createReel(videoUrl: string, caption?: string) {
    return this.api.createReel(videoUrl, caption)
  }
}

export class InstagramMessageService {
  private api: InstagramAPI

  constructor(accessToken?: string) {
    this.api = new InstagramAPI(accessToken)
  }

  setAccessToken(token: string) {
    this.api.setAccessToken(token)
  }

  async getConversations() {
    return this.api.getConversations()
  }

  async getMessages(conversationId: string, limit = 25) {
    return this.api.getMessages(conversationId, limit)
  }

  async sendMessage(userId: string, message: string) {
    return this.api.sendMessage(userId, message)
  }
}

export class InstagramPostService {
  private api: InstagramAPI

  constructor(accessToken?: string) {
    this.api = new InstagramAPI(accessToken)
  }

  setAccessToken(token: string) {
    this.api.setAccessToken(token)
  }

  async getMedia(userId: string, limit = 25) {
    return this.api.getMedia(userId, limit)
  }

  async getMediaInsights(mediaId: string) {
    return this.api.getMediaInsights(mediaId)
  }
}

export class InstagramCommentService {
  private api: InstagramAPI

  constructor(accessToken?: string) {
    this.api = new InstagramAPI(accessToken)
  }

  setAccessToken(token: string) {
    this.api.setAccessToken(token)
  }

  async getComments(mediaId: string, limit = 50) {
    return this.api.getMediaComments(mediaId, limit)
  }

  async replyToComment(commentId: string, message: string) {
    return this.api.replyToComment(commentId, message)
  }

  async deleteComment(commentId: string) {
    return this.api.deleteComment(commentId)
  }

  async hideComment(commentId: string, hide: boolean = true) {
    return this.api.hideComment(commentId, hide)
  }
}
