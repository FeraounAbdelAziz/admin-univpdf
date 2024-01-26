import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { Suspense } from "react";

import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

import Nav from "./nav";

import { ColorSchemeScript, DirectionProvider, MantineProvider } from "@mantine/core";

export const metadata = {
  title: "Next.js App Router + NextAuth + Tailwind CSS",
  description:
    "A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className="bg-gray-100" >
          <MantineProvider defaultColorScheme="light" forceColorScheme="light" >
            <Suspense>
              <Nav />
            </Suspense>
            {children}
          </MantineProvider>
      </body>
      <Analytics />
      {/* <Toast /> */}
    </html>
  );
}
