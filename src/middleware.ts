import { User, createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { refreshSession } from './utils/getProviderAccessTokens';

/**
 * Any Server Component route that uses a Supabase client must be added to this
 * middleware's `matcher` array. Without this, the Server Component may try to make a
 * request to Supabase with an expired `access_token`.
 */

interface ExtendedUser extends User {
  providerAccessToken: string;
  providerRefreshToken: string;
}


export async function middleware(req: NextRequest) {




  const res = NextResponse.next();




  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession()


  const {
    data: { user },
  } = await supabase.auth.getUser()




  console.log(session?.user)




  // if user is signed in and the current path is / redirect the user to /account
  if (user &&
    (session?.user as ExtendedUser)?.providerAccessToken &&
    (session?.user as ExtendedUser)?.providerRefreshToken &&
    req.nextUrl.pathname === '/login'
  ) {

    return NextResponse.redirect(new URL('/', req.url))

  }



  if (

    !(user &&
      (session?.user as ExtendedUser)?.providerAccessToken &&
      (session?.user as ExtendedUser)?.providerRefreshToken) &&
    req.nextUrl.pathname !== '/login'

  ) {
    // await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/login', req.url))

  }


  return res;


}



export const config = {
  matcher: ['/', '/login', '/dashboard', '/dashboard/:path*'],
};