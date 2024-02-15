"use server"
import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '../components/navbar';
import { cookies } from 'next/headers';

export default async function Nav() {


  const supabase = createServerComponentClient({ cookies })



  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  const {
    data: { user  }
  } = await supabase.auth.getUser()





  // pass User to the navbar


  return <Navbar session={session} user={user} />;
}


