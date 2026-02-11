import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongodb";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const collectionName = "blogs";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const calculateReadingTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const withRetries = async (fn, retries = 2) => {
  let lastErr;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
};

const parseJsonFromText = (text) => {
  if (!text) return null;
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");
    const start =
      firstBracket !== -1 && (firstBracket < firstBrace || firstBrace === -1)
        ? firstBracket
        : firstBrace;
    if (start === -1) return null;
    try {
      return JSON.parse(cleaned.slice(start));
    } catch {
      return null;
    }
  }
};

const callGemini = async ({ apiKey, model, input, tools }) => {
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: input }],
        },
      ],
      tools,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = await res.json();
  if (!data?.candidates?.length) return "";
  const parts = data.candidates[0]?.content?.parts || [];
  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("");
};

const buildTopicPrompt = (count) => `
You are TrendyStory's growth-focused editor. Use current web context to pick ${count}
high-click, trend-aligned topics people are searching for today. Prioritize timely, practical
angles with strong reader intent (how-to, playbook, benchmarks, checklists, comparisons).

Return ONLY valid JSON: an array of objects with:
title, angle, category, and keywords (array of 3-5 strings).

Constraints:
- Suitable for a tech/productivity/AI adoption blog.
- No politics, no health/medical claims.
- Titles must be specific and curiosity-driven, but not misleading.
`;

const buildDraftPrompt = ({ title, angle, category, keywords }) => `
Write a high-performing, click-worthy blog post draft based on:
Title: ${title}
Angle: ${angle}
Category: ${category}
Keywords: ${Array.isArray(keywords) ? keywords.join(", ") : ""}

Voice & structure:
- Hook fast: first 2-3 sentences must earn the click.
- Use a skimmable structure: short paragraphs, bullets, and clear subheads.
- Use at least one numbered framework (e.g., "5 Steps", "3 Layers", "7 Signals").
- Include a short mini case study or vignette (3-5 sentences) to ground the advice.
- Add a "Common Mistakes" section with 3-5 bullets.
- Provide practical, original insights and concrete examples.
- Include a "Quick Takeaways" bullet list near the top.
- Add a "What to Do This Week" mini checklist near the end.

Constraints:
- 900-1300 words.
- Avoid quoting sources verbatim and avoid fabricated claims.
- No exaggerated or unverifiable promises.
- Output ONLY JSON with keys: title, excerpt, content, category, cover_image_url.
- excerpt: 1-2 sentences, punchy, no fluff.
- cover_image_url must be a direct https image URL (jpg or png) suitable for a blog hero image.
`;

const isValidImageUrl = (value) => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    return isHttp && /\.(jpe?g|png)(\?.*)?$/i.test(url.pathname);
  } catch {
    return false;
  }
};

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? verifyAdminToken(token) : null;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const requestedCount = Number(body?.count ?? 3);
  const count = clamp(requestedCount, 3, 5);
  const publish = Boolean(body?.publish);
  const defaultCategory = body?.category || "AI Productivity";
  const dayKey = getDayKey();

  const db = await getDb();

  // Basic daily quota to prevent abuse
  const quotaPerDay = Number(process.env.AI_DAILY_QUOTA ?? 6);
  const usage = await db
    .collection("ai_runs")
    .findOne({ type: "daily_blog", day_key: dayKey });
  const used = usage?.count ?? 0;
  if (used >= quotaPerDay) {
    return NextResponse.json(
      { error: "Daily AI quota reached." },
      { status: 429 }
    );
  }

  let topicsText;
  try {
    topicsText = await withRetries(
      () =>
        callGemini({
          apiKey,
          model,
          input: buildTopicPrompt(count),
          tools: [{ google_search: {} }],
        }),
      2
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch topics", details: err.message },
      { status: 500 }
    );
  }

  const topicsJson = parseJsonFromText(topicsText);
  const topics = Array.isArray(topicsJson)
    ? topicsJson
    : Array.isArray(topicsJson?.topics)
    ? topicsJson.topics
    : [];

  if (topics.length === 0) {
    return NextResponse.json(
      { error: "No topics generated", raw: topicsText },
      { status: 500 }
    );
  }

  const now = new Date();
  const results = [];

  for (const topic of topics.slice(0, count)) {
    const draftText = await withRetries(
      () =>
        callGemini({
          apiKey,
          model,
          input: buildDraftPrompt(topic),
        }),
      1
    );
    const draftJson = parseJsonFromText(draftText) || {};

    const title = draftJson.title || topic.title || "Untitled";
    const content = draftJson.content || "";
    const excerpt = draftJson.excerpt || "";
    const category = draftJson.category || topic.category || defaultCategory;
    const coverImageUrl =
      draftJson.cover_image_url || draftJson.cover_image || null;

    if (!content) {
      results.push({ title, ok: false, reason: "Empty content" });
      continue;
    }

    const existing = await db
      .collection(collectionName)
      .findOne({ slug: slugify(title) });
    if (existing) {
      results.push({ title, ok: false, reason: "Duplicate title" });
      continue;
    }

    const document = {
      title,
      slug: slugify(title),
      author: "TrendyStory Editorial",
      excerpt,
      content,
      cover_image: isValidImageUrl(coverImageUrl) ? coverImageUrl : null,
      category,
      reading_time: calculateReadingTime(content),
      status: publish ? "published" : "draft",
      views: 0,
      likes: 0,
      saves: 0,
      created_at: now,
      updated_at: now,
      published_at: publish ? now : null,
    };

    const insert = await db.collection(collectionName).insertOne(document);
    results.push({
      ok: true,
      id: insert.insertedId.toString(),
      title,
      status: document.status,
    });
  }

  await db.collection("ai_runs").updateOne(
    { type: "daily_blog", day_key: dayKey },
    {
      $set: { updated_at: now },
      $inc: { count: results.filter((r) => r.ok).length || 1 },
    },
    { upsert: true }
  );

  return NextResponse.json({
    ok: true,
    created: results.filter((r) => r.ok).length,
    results,
  });
}
