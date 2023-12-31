import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Open_Sans, Anonymous_Pro } from "next/font/google";
import "../styles/globals.css";
import Background from "../components/layout/background";
import Provider from "@/components/providers/theme-provider";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open",
});
const AnonPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anon",
});

export const metadata: Metadata = {
  title: "Realtime Demo",
  description: "A simple realtime demo built with Liveblocks and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${AnonPro.variable} font-open`}>
        <Provider>
          <Background>{children}</Background>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
