import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, cookieOptions, refreshTokens } from '@/src/shared/lib/auth'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (accessToken || !refreshToken) return NextResponse.next()

  const tokens = await refreshTokens(refreshToken)

  if (!tokens) {
    const response = NextResponse.next()
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  request.cookies.set('access_token', tokens.accessToken)
  const response = NextResponse.next({ request })

  response.cookies.set('access_token', tokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  return response
}
