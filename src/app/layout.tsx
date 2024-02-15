import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { Suspense } from "react";

import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import Nav from "./nav";

import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
export const metadata = {
  title: "Next.js App Router + NextAuth + Tailwind CSS",
  description:
    "A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.",
};
import AuthProvider from "@/context/authContextProvider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";

// do not cache this layout
export const revalidate = 0;


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();


  return (
    <html lang="en" >
      <body >
        <MantineProvider defaultColorScheme="light" forceColorScheme="light" >
          <Notifications />
          <AuthProvider accessToken={session?.access_token} >
            <Suspense>
              <Nav />
            </Suspense>
            {children}
          </AuthProvider>
          {/* <div style={{ padding: '100px' }} ></div> */}
        </MantineProvider>
      </body>
      <Analytics />
      
      {/* <Toast /> */}
    </html >
  );
}
