import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  ExternalLink,
  Clock,
  Calendar,
} from "lucide-react";
import { getAllBlogsAdmin } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin();

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Manage Blogs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You have{" "}
            <span className="font-bold text-blue-600">
              {blogs?.length || 0}
            </span>{" "}
            total posts in your library.
          </p>
        </div>
        <Link
          href="/main/admin/blogs/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <PlusCircle size={18} />
          Create New Post
        </Link>
      </div>

      {/* 3. Modern Table */}
      <div className=" rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Blog Detail
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date Info
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="group hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="max-w-[300px]">
                        <p className="font-bold text-gray-900 truncate">
                          {blog.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-tighter">
                          ID: {blog.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          blog.status === "published"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock size={12} />
                        Updated{" "}
                        {blog.updated_at
                          ? new Date(blog.updated_at).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/main/admin/blogs/edit/${blog.id}`}
                        className="px-4 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${blog.slug || blog.id}`}
                        className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
