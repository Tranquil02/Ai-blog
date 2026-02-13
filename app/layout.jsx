import "./globals.css";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site"
  ),
  manifest: "/manifest.webmanifest",
  title: "TrendyStory | AI Productivity for Small Business",
  description:
    "TrendyStory helps small businesses use AI to automate operations, cut costs, and grow faster with practical playbooks.",
  keywords: [
    "chatgpt for business",
    "ai tools for business",
    "ai automation",
    "ai agents",
    "workflow automation",
    "small business automation",
    "ai for small business",
    "business process automation",
    "prompt engineering for business",
    "ai marketing automation",
    "sales automation ai",
    "customer support ai",
    "no-code automation",
    "n8n automation",
    "zapier alternatives",
    "operational efficiency with ai",
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
      <body>{children}</body>
    </html>
  );
}
