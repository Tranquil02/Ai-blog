import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Footer from "@/components/footer";
import ArticleViewClient from "./ArticleViewClient";
import { getDb } from "@/lib/mongodb";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const fetchPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/blog/get/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.blog;
};

const fetchPostBySlug = async (slug) => {
  const db = await getDb();
  const doc = await db.collection("blogs").findOne({
    slug,
    status: "published",
  });
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    ...doc,
    published_at: doc.published_at
      ? new Date(doc.published_at).toISOString()
      : null,
    created_at: doc.created_at ? new Date(doc.created_at).toISOString() : null,
    updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : null,
  };
};

const fetchPost = async (idOrSlug) => {
  if (ObjectId.isValid(idOrSlug)) {
    const byId = await fetchPostById(idOrSlug);
    if (byId) return byId;
  }
  return fetchPostBySlug(idOrSlug);
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
