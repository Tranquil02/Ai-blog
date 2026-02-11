// 'use client';

import "../globals.css";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import LocomotiveProvider from '@/Provider/Locomotiveprovider';
import NavbarWrapper from '@/components/NavbarWrapper';
import NavObserver from '@/components/Navobserver';
import Provider from '@/lib/tanstack_query';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata = {
  title: {
    default: "TrendyStory | AI Productivity for Small Business",
    template: "%s | TrendyStory",
  },
  description:
    "AI productivity playbooks and automation workflows for small business teams.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TrendyStory | AI Productivity for Small Business",
    description:
      "AI productivity playbooks and automation workflows for small business teams.",
    url: "/",
    siteName: "TrendyStory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendyStory | AI Productivity for Small Business",
    description:
      "AI productivity playbooks and automation workflows for small business teams.",
  },
};

export default function PublicLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TrendyStory",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    description:
      "TrendyStory publishes AI productivity playbooks for small businesses.",
  };

  return (
    <div
      className={`
        ${spaceGrotesk.variable}
        ${fraunces.variable}
        font-sans
        bg-[var(--bg-primary)]
        text-[var(--text-primary)]
      `}
    >
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavbarWrapper />
      <NavObserver />

      <LocomotiveProvider>
        <Provider>
          <div id="nav-sentinel" className="h-[50px]" aria-hidden="true" />
          {children}
        </Provider>
      </LocomotiveProvider>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}
