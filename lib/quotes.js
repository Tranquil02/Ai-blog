import { getDb } from "./mongodb";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const QUOTES_COLLECTION = "quotes";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

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
      contents: [{ parts: [{ text: input }] }],
      tools,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${res.status} ${err}`);
  }

  const data = await res.json();
  if (!data?.candidates?.length) return "";
  const parts = data.candidates[0]?.content?.parts || [];
  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("");
};

const buildQuotesPrompt = (count, mode = "daily") => `
You are TrendyStory's AI editor. Generate ${count} original, catchy quotes about AI adoption,
agentic workflows, modern productivity, and building with focus. Keep each quote 8-18 words.
Avoid clichés and avoid repeating ideas. Tone: sharp, practical, optimistic.

Return ONLY valid JSON: an array of objects with keys:
- text (string)
- author (string, use "TrendyStory AI")

No markdown, no commentary.
Mode: ${mode}.
`;

const normalizeQuotes = (items = []) => {
  const unique = new Map();
  items.forEach((item) => {
    const text = String(item?.text || "").trim();
    if (!text) return;
    const cleaned = text.replace(/^["'“”]+|["'“”]+$/g, "").trim();
    const key = cleaned.toLowerCase();
    if (unique.has(key)) return;
    unique.set(key, {
      text: cleaned,
      author: item?.author ? String(item.author).trim() : "TrendyStory AI",
    });
  });
  return Array.from(unique.values());
};

const generateQuotes = async ({ count, mode }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const raw = await callGemini({
    apiKey,
    model,
    input: buildQuotesPrompt(count, mode),
  });
  const parsed = parseJsonFromText(raw);
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.quotes)
    ? parsed.quotes
    : [];
  return normalizeQuotes(list).slice(0, count);
};

export async function ensureSeedQuotes({ count = 10 } = {}) {
  const db = await getDb();
  const total = await db.collection(QUOTES_COLLECTION).countDocuments();
  if (total > 0) return { ok: true, skipped: true };

  const safeCount = clamp(Number(count) || 10, 8, 12);
  const quotes = await generateQuotes({ count: safeCount, mode: "seed" });
  if (!quotes.length) return { ok: false, error: "No quotes generated" };

  const now = new Date();
  const docs = quotes.map((quote) => ({
    ...quote,
    kind: "seed",
    day_key: getDayKey(now),
    created_at: now,
  }));

  await db.collection(QUOTES_COLLECTION).insertMany(docs);
  return { ok: true, created: docs.length };
}

export async function ensureDailyQuotes({ count = 3 } = {}) {
  const db = await getDb();
  const dayKey = getDayKey();
  const existing = await db
    .collection(QUOTES_COLLECTION)
    .countDocuments({ day_key: dayKey, kind: "daily" });
  if (existing >= 2) return { ok: true, skipped: true };

  const safeCount = clamp(Number(count) || 3, 2, 3);
  const quotes = await generateQuotes({ count: safeCount, mode: "daily" });
  if (!quotes.length) return { ok: false, error: "No quotes generated" };

  const now = new Date();
  const docs = quotes.map((quote) => ({
    ...quote,
    kind: "daily",
    day_key: dayKey,
    created_at: now,
  }));

  await db.collection(QUOTES_COLLECTION).insertMany(docs);
  return { ok: true, created: docs.length };
}

export async function getQuotesForPage() {
  const db = await getDb();
  const dayKey = getDayKey();
  const daily = await db
    .collection(QUOTES_COLLECTION)
    .find({ day_key: dayKey })
    .sort({ created_at: -1 })
    .toArray();

  const archive = await db
    .collection(QUOTES_COLLECTION)
    .find({ day_key: { $ne: dayKey } })
    .sort({ created_at: -1 })
    .limit(30)
    .toArray();

  return { daily, archive, dayKey };
}
