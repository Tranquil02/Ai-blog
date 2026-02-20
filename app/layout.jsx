import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Ad Script */}
        <Script
          id="ad-network-script"
          src="https://pl28710742.effectivegatecpm.com/06/bf/79/06bf7971603cd012368da082f6bc412c.js"
          strategy="afterInteractive"
        />

        {children}

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}