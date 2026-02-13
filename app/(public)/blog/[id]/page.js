import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Footer from "@/components/footer";
import ArticleViewClient from "./ArticleViewClient";
import { getBlogById, getBlogBySlug } from "@/lib/blog";

export const revalidate = 60;

const fetchPost = async (idOrSlug) => {
  if (ObjectId.isValid(idOrSlug)) {
    const byId = await getBlogById(idOrSlug);
    if (byId) return byId;
  }
  return getBlogBySlug(idOrSlug);
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return {
      title: "Blog Not Found",
      robots: { index: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug || post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) notFound();

  return (
    <>
      <ArticleViewClient post={post} />
      <Footer />
    </>
  );
}
