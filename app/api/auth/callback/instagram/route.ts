import { NextRequest, NextResponse } from 'next/server'
import { saveCredentials } from '@/lib/instagram/credentials'
import { getClientId, getClientSecret, getRedirectUri } from '@/lib/instagram/app-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const state = searchParams.get('state')

    if (error) {
      console.error('[Instagram OAuth] Error:', error, errorReason)
      const redirectUrl = new URL('/settings/integrations', getRedirectUri())
      redirectUrl.searchParams.set('error', 'instagram_auth_failed')
      return NextResponse.redirect(redirectUrl)
    }

    if (!code) {
      const redirectUrl = new URL('/settings/integrations', getRedirectUri())
      redirectUrl.searchParams.set('error', 'missing_code')
      return NextResponse.redirect(redirectUrl)
    }

    const clientId = getClientId()
    const clientSecret = getClientSecret()
    const redirectUri = getRedirectUri()

    if (!clientId || !clientSecret) {
      console.error('[Instagram OAuth] Client ID or Secret not configured')
      const redirectUrl = new URL('/settings/integrations', getRedirectUri())
      redirectUrl.searchParams.set('error', 'client_not_configured')
      return NextResponse.redirect(redirectUrl)
    }

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error('[Instagram OAuth] Token exchange failed:', errorData)
      const redirectUrl = new URL('/settings/integrations', getRedirectUri())
      redirectUrl.searchParams.set('error', 'token_exchange_failed')
      return NextResponse.redirect(redirectUrl)
    }

    const tokenData = await tokenResponse.json()

    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`
    )

    let accessToken = tokenData.access_token
    let expiresIn = tokenData.expires_in

    if (longLivedResponse.ok) {
      const longLivedData = await longLivedResponse.json()
      accessToken = longLivedData.access_token
      expiresIn = longLivedData.expires_in
    }

    const userId = String(tokenData.user_id)

    let username = ''
    let accountType = ''
    try {
      const userResponse = await fetch(
        `https://graph.instagram.com/${userId}?fields=id,username,account_type,media_count&access_token=${accessToken}`
      )
      const userData = await userResponse.json().catch(() => ({}))
      username = userData.username || ''
      accountType = userData.account_type || ''
      console.log('[Instagram OAuth] User data:', userData)
    } catch (e) {
      console.error('[Instagram OAuth] Error getting user data:', e)
    }

    console.log('[Instagram OAuth] Success:', {
      userId,
      username,
      accountType,
    })

    saveCredentials({
      accessToken,
      userId,
      username,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined
    })

    const redirectUrl = new URL('/settings/integrations', getRedirectUri())
    redirectUrl.searchParams.set('instagram_connected', 'true')
    redirectUrl.searchParams.set('username', username)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('[Instagram OAuth] Unexpected error:', error)
    const redirectUrl = new URL('/settings/integrations', getRedirectUri())
    redirectUrl.searchParams.set('error', 'unexpected_error')
    return NextResponse.redirect(redirectUrl)
  }
}
