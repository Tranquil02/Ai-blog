"use client";

import { useState } from "react";
import axios from "axios";
import { Sparkles, LoaderCircle } from "lucide-react";

export default function AdminAIPage() {
  const [count, setCount] = useState(3);
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const { data } = await axios.post("/api/admin/ai/daily", {
        count,
        publish,
      });
      if (!data?.ok) {
        throw new Error(data?.error || "Generation failed");
      }
      setResults(data.results || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Drafts</h1>
              <p className="text-sm text-gray-500">
                Generate 3-5 trending topic drafts and save as drafts.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              {loading ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? "Generating..." : "Generate Drafts"}
            </button>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">
              Count
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="ml-2 bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-semibold"
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              Publish immediately
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Results</h2>
            <div className="divide-y divide-gray-50">
              {results.map((r, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-400">
                      {r.ok ? `Created (${r.status})` : `Failed: ${r.reason}`}
                    </div>
                  </div>
                  {r.id && (
                    <a
                      href={`/main/admin/blogs/edit/${r.id}`}
                      className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Edit
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
