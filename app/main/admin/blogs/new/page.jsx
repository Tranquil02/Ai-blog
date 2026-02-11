'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  ArrowLeft, Save, Image as ImageIcon,
  Clock, AlertCircle, Upload, X, AlignLeft
} from 'lucide-react';

export default function AddBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    author: 'TrendyStory Editorial',
    category: 'AI Productivity',
    tags: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const readingTime = form.content ? Math.max(1, Math.ceil(form.content.trim().split(/\s+/).length / 200)) : 0;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check File Type (JPG, PNG)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Only JPG and PNG are allowed.");
        return;
      }

      // 2. Check File Size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File is too large. Maximum size allowed is 5MB.");
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    await axios.post("/api/admin/blogs", {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      author: form.author,
      category: form.category,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      cover_image: imageData,
    });

    router.push("/main/admin");
  } catch (err) {
    console.error(err);
    setError(err.message);
    setLoading(false);
  }
};


  return (
    <div className="w-full">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-blue-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">New Publication</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Save size={18} /> {loading ? 'Processing...' : 'Publish Blog'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex gap-3">
              <AlertCircle size={20} /> <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className=" rounded-3xl border border-gray-200 p-8 shadow-sm min-h-[500px]">
            <input
              name="title"
              placeholder="Headline..."
              className="bg-gray-100 w-full text-4xl font-black placeholder:text-gray-500 border-black rounded-xl focus:ring-0 p-3 mb-4 text-gray-900"
              onChange={handleChange}
            />
            <div className="h-px bg-gray-50 w-full mb-8" />
            <textarea
              name="content"
              placeholder="Start writing..."
              className="w-full min-h-[400px] text-lg leading-relaxed placeholder:text-gray-500 border-none rounded-xl focus:ring-0 p-5 resize-none bg-gray-100 text-gray-700 font-medium"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className=" rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2 ">
              <AlignLeft size={16} /> Excerpt
            </h3>
            <p className="text-[10px] text-gray-400 mb-4 font-semibold uppercase tracking-wider">
              display a short summary of your blog post.
            </p>
            <textarea
              name="excerpt"
              placeholder="Short summary..."
              className="w-full bg-gray-100 border-none  text-black rounded-2xl px-4 py-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500/10 outline-none resize-none"
              onChange={handleChange}
            />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-600" /> Image Cover
            </h3>
            <p className="text-[10px] text-gray-400 mb-4 font-semibold uppercase tracking-wider">
              Allowed: PNG, JPG • Max: 5MB
            </p>

            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".jpg,.jpeg,.png" />

            {!previewUrl ? (
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full aspect-video border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <Upload size={20} className="text-gray-300 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Select Image</span>
              </button>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                <Image
                  src={previewUrl}
                  alt="Local Preview"
                  width={1280}
                  height={720}
                  className="w-full aspect-video object-cover"
                  unoptimized
                />
                <button
                  onClick={() => {
                    setPreviewUrl("");
                    setImageData(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className=" text-black rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</label>
                <input
                  name="author"
                  value={form.author}
                  className="w-full mt-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                <input
                  name="category"
                  value={form.category}
                  className="w-full mt-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tags (comma separated)</label>
                <input
                  name="tags"
                  value={form.tags}
                  className="w-full mt-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visibility</label>
                <select
                  name="status"
                  value={form.status}
                  className="w-full mt-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold pt-2 border-t border-gray-50">
                <Clock size={14} /> <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
