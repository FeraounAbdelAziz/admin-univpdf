import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { searchParams } = new URL(req.url)

  const code = searchParams.get('code')

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw error;
    }

    const { session } = data;

    {

      if (!session.provider_token && !session.provider_refresh_token) {
        throw new Error("Both provider_token and provider_refresh_token are missing")
      }



      // save auth token & refresh token for a current user profile.
      const { error } = await supabase
        .from("admin_profile")
        .update({
          provider_access_token: session.provider_token,
          provider_refresh_token: session.provider_refresh_token,
        })
        .eq("admin_id", session.user.id)
        .select()
        .single();


      if (error) {
        // handle error.
        throw error;
      }
    }

  }





  return NextResponse.redirect(new URL('/dashboard', req.url))
}