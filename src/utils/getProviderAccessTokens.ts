'use server';

import { User, createClientComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";


import { cookies } from "next/headers";

interface ExtendedUser extends User {
    provider_access_token: string;
    provider_refresh_token: string;
}


// import { clearScreenDown } from "readline";

// export async function getServerProviderAccessTokens() {
//     "use server";
//     const supabase = createServerActionClient({ cookies })

//     const { data: { session } } = await supabase.auth.getSession()

//     const { data, error } = await supabase
//         .from('admin_profile')
//         .select('provider_access_token, provider_refresh_token')
//         .eq('admin_id', session?.user.id)
//         .single()

//     if (error) {
//         throw Error("unsubscribe admin")
//     }

//     if (data) {
//         return { provider_access_token: data.provider_access_token, provider_refresh_token: data.provider_refresh_token }
//     }

// }


// export async function getProviderAccessToken() {

//     const supabase = createClientComponentClient()

//     const { data: { session } } = await supabase.auth.getSession()

//     const { data, error } = await supabase
//         .from('admin_profile')
//         .select('provider_access_token, provider_refresh_token')
//         .eq('admin_id', session?.user.id)
//         .single()

//     if (error) {
//         throw Error("unsubscribe admin")
//     }

//     if (data) {
//         return { provider_access_token: data.provider_access_token, provider_refresh_token: data.provider_refresh_token }
//     }


// }

export async function refreshSession(provider_refresh_token?: string | null | undefined) {


    const supabase = createServerActionClient({ cookies })
    // const supabase = createClientComponentClient()

    const { data: { session } } = await supabase.auth.getSession()

    const providerRefreshToken = (session?.user as ExtendedUser)?.provider_refresh_token


    
    if (session && providerRefreshToken) {

        const url = 'https://oauth2.googleapis.com/token';
        const method = 'POST';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        

        const body = new URLSearchParams({
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
            grant_type: 'refresh_token',
            refresh_token: providerRefreshToken!,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            scopes: 'https://www.googleapis.com/auth/drive',
            prompt: 'consent',
            access_type: 'offline',
            approval_prompt: 'force'
        });

        fetch(url, {
            method: method,
            headers: headers,
            body: body,
        })

            .then(response => response.json())
            .then(async (data) => {


                if (providerRefreshToken) {
                    await supabase.from('admin_profile').update({
                        provider_access_token: data.access_token,
                        provider_refresh_token: providerRefreshToken
                    }).eq('admin_id', session.user.id)
                    console.log('google token refreshed')
                }
                else if (provider_refresh_token) {

                    await supabase.from('admin_profile').update({
                        provider_access_token: data.access_token,
                        provider_refresh_token: provider_refresh_token
                    }).eq('admin_id', session.user.id)



                } else {
                    console.error('refresh token is null')
                }


            })
            .catch(async (error) => {

                await supabase.from('admin_profile').update({
                    provider_access_token: null,
                    provider_refresh_token: null
                }).eq('admin_id', session.user.id)

                console.error('Error:', error)

            });

    } else {
        console.log('unauthorized')
    }
}
