const AI_CLICHE_PHRASES = [
  "in today's fast-paced world",
  "delve into",
  "unlock the power",
  "game changer",
  "revolutionize",
  "seamlessly",
  "leverage ai",
  "in conclusion",
  "it's important to note",
];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const normalizeText = (value = "") => String(value).replace(/\r/g, "").trim();

const wordsFrom = (value = "") =>
  normalizeText(value).split(/\s+/).filter(Boolean);

const splitSentences = (value = "") =>
  normalizeText(value)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

const splitParagraphs = (value = "") =>
  normalizeText(value)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const toIssue = (severity, code, message) => ({ severity, code, message });

const countRegexMatches = (text, regex) => {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
};

const repeatedSentenceRatio = (sentences) => {
  if (sentences.length === 0) return 0;
  const normalized = sentences.map((s) => s.toLowerCase().replace(/\W+/g, " ").trim());
  const uniqueCount = new Set(normalized).size;
  return 1 - uniqueCount / normalized.length;
};

export function analyzeBlogQuality({
  title = "",
  excerpt = "",
  content = "",
  status = "draft",
}) {
  const safeTitle = normalizeText(title);
  const safeExcerpt = normalizeText(excerpt);
  const safeContent = normalizeText(content);

  const titleLen = safeTitle.length;
  const excerptLen = safeExcerpt.length;
  const words = wordsFrom(safeContent);
  const wordCount = words.length;
  const paragraphs = splitParagraphs(safeContent);
  const sentences = splitSentences(safeContent);
  const avgSentenceWords =
    sentences.length > 0 ? words.length / sentences.length : 0;

  const hasHeading = /(^|\n)#{1,3}\s+\S+/m.test(safeContent);
  const urlMatches = safeContent.match(/https?:\/\/[^\s)]+/g) || [];
  const outboundLinks = urlMatches.filter(
    (url) =>
      !url.includes("trendystory.site") &&
      !url.includes("localhost")
  );
  const internalLinks = countRegexMatches(
    safeContent,
    /(https?:\/\/(www\.)?trendystory\.site\/[^\s)]+|\/blog\/[^\s)]+)/gi
  );
  const dataSignals = countRegexMatches(safeContent, /\b\d+(\.\d+)?%?\b/g);

  const foundCliches = AI_CLICHE_PHRASES.filter((phrase) =>
    safeContent.toLowerCase().includes(phrase)
  );
  const repetitionRatio = repeatedSentenceRatio(sentences);

  const issues = [];

  if (titleLen < 35 || titleLen > 70) {
    issues.push(
      toIssue(
        "warn",
        "title_length",
        "Title length should be between 35 and 70 characters."
      )
    );
  }

  if (excerptLen > 0 && (excerptLen < 120 || excerptLen > 220)) {
    issues.push(
      toIssue(
        "warn",
        "excerpt_length",
        "Excerpt should be between 120 and 220 characters."
      )
    );
  }

  if (wordCount < 350) {
    issues.push(
      toIssue(
        status === "published" ? "error" : "warn",
        "word_count_low",
        "Content is too short. Aim for at least 350 words."
      )
    );
  }

  if (paragraphs.length < 3) {
    issues.push(
      toIssue(
        "warn",
        "paragraph_structure",
        "Add more paragraph breaks to improve readability."
      )
    );
  }

  if (avgSentenceWords > 30) {
    issues.push(
      toIssue(
        "warn",
        "sentence_length",
        "Average sentence length is high. Use shorter sentences."
      )
    );
  }

  if (!hasHeading) {
    issues.push(
      toIssue(
        "warn",
        "missing_headings",
        "Add section headings to improve scanability."
      )
    );
  }

  if (outboundLinks.length === 0) {
    issues.push(
      toIssue(
        "warn",
        "missing_sources",
        "Add at least one external source link."
      )
    );
  }

  if (internalLinks === 0) {
    issues.push(
      toIssue(
        "warn",
        "missing_internal_links",
        "Add at least one internal link to a related page."
      )
    );
  }

  if (dataSignals === 0) {
    issues.push(
      toIssue(
        "warn",
        "missing_data_points",
        "Include concrete numbers, metrics, or examples."
      )
    );
  }

  if (foundCliches.length > 0) {
    issues.push(
      toIssue(
        "warn",
        "ai_cliches",
        `Reduce generic phrasing: ${foundCliches.slice(0, 3).join(", ")}.`
      )
    );
  }

  if (repetitionRatio > 0.2) {
    issues.push(
      toIssue(
        "warn",
        "repetition",
        "Repeated sentences detected. Rewrite duplicated parts."
      )
    );
  }

  const penalties = issues.reduce((sum, issue) => {
    if (issue.severity === "error") return sum + 20;
    return sum + 6;
  }, 0);

  const score = clamp(100 - penalties, 0, 100);
  const blockPublish = status === "published" && issues.some((i) => i.severity === "error");

  return {
    score,
    blockPublish,
    issues,
    metrics: {
      titleLength: titleLen,
      excerptLength: excerptLen,
      wordCount,
      paragraphCount: paragraphs.length,
      averageSentenceWords: Number(avgSentenceWords.toFixed(1)),
      outboundLinkCount: outboundLinks.length,
      internalLinkCount: internalLinks,
      dataPointCount: dataSignals,
    },
  };
}
