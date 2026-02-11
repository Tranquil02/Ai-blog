import { FileText, ChevronRight, ExternalLink, Clock, PlusCircle } from "lucide-react";
import { getAllBlogsAdmin } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const blogs = await getAllBlogsAdmin();
  const blogCount = blogs?.length || 0;

  return (
    <>
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-3 justify-end absolute top-25 right-8">
            <a
              href="/main/admin/ai"
              className="flex items-center -2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-gray-200"
            >
              <FileText size={18} />
              AI Drafts
            </a>
            <a
              href="/main/admin/blogs/new"
              className="flex items-center -2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
            >
              <PlusCircle size={18} />
              New Post
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Total Blog Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {blogCount}
              </p>
            </div>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Blogs
                </h2>
                <p className="text-sm text-gray-500">
                  Manage and edit your latest content
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/main/admin/blogs"
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                >
                  View All Posts <ChevronRight size={16} />
                </a>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {blogs.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">
                  No blogs found
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <FileText size={24} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {blog.title}
                        </h4>

                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {blog.created_at
                              ? new Date(blog.created_at).toLocaleDateString()
                              : "-"}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]
                              ${
                                blog.status === "published"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                          >
                            {blog.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/main/admin/blogs/edit/${blog.id}`}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                      >
                        Edit
                      </a>

                      <a
                        href={`/blog/${blog.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
