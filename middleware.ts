import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // ─── RULE 1: Not logged in → send to /login ───
  if (!session) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // ─── RULE 2: Logged in, trying to access /login → send to dashboard ───
  if (session && pathname === '/login') {
    // Check if profile complete
    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('profile_completed')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || !profile.profile_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ─── RULE 3: Logged in, accessing /dashboard without complete profile ───
  if (session && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('profile_completed')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || !profile.profile_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // ─── RULE 4: Logged in with complete profile, accessing /onboarding → dashboard ───
  if (session && pathname === '/onboarding') {
    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('profile_completed')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.profile_completed) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/login'],
}
