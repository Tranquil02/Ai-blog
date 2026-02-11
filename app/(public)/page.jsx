import HomeClient from './HomeClient';

export const metadata = {
  title: "TrendyStory",
  description:
    "AI productivity playbooks and workflows tailored for small business teams.",
};

export default async function Home() {
  return <HomeClient initialBlogs={[]} />;
}
