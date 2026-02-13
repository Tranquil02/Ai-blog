export default function manifest() {
  return {
    name: "TrendyStory",
    short_name: "TrendyStory",
    description:
      "AI productivity playbooks and automation workflows for small business teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#111111",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
