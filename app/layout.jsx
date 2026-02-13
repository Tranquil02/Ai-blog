import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site"
  ),
  title: "TrendyStory | AI Productivity for Small Business",
  description:
    "TrendyStory helps small businesses use AI to automate operations, cut costs, and grow faster with practical playbooks.",
  keywords: [
    "AI productivity",
    "AI for small business",
    "automation for small business",
    "AI workflows",
    "AI tools",
    "business automation",
    "operations automation",
    "marketing automation",
    "sales automation",
    "customer support automation",
    "SaaS productivity",
    "business growth",
    "startup playbooks",
    "founder resources",
    "TrendyStory",
  ],
  openGraph: {
    title: "TrendyStory | AI Productivity for Small Business",
    description:
      "Practical AI playbooks and workflows for small business teams.",
    type: "website",
    siteName: "TrendyStory",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendyStory | AI Productivity for Small Business",
    description:
      "Practical AI playbooks and workflows for small business teams.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
