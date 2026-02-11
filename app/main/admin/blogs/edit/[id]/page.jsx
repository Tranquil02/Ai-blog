import { notFound } from "next/navigation";
import { getBlogByIdAdmin } from "@/lib/blog";
import EditBlogClient from "./blogEdit";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const blog = await getBlogByIdAdmin(id);

  if (!blog) notFound();

  return <EditBlogClient blog={blog} />;
}
