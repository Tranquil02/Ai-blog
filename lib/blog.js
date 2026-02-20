
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const BLOG_COLLECTION = "blogs";
const QUERY_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 15_000);
const ENABLE_RUNTIME_INDEXING =
  process.env.ENABLE_RUNTIME_INDEXING === "true" ||
  process.env.NODE_ENV !== "production";
const BLOG_LIST_PROJECTION = {
  title: 1,
  slug: 1,
  excerpt: 1,
  category: 1,
  author: 1,
  reading_time: 1,
  published_at: 1,
  created_at: 1,
  updated_at: 1,
  likes: 1,
  views: 1,
  saves: 1,
  tags: 1,
  status: 1,
};
const PUBLISHED_MATCH_STAGE = { $match: { status: "published" } };
const BLOG_LIST_PROJECT_STAGE = {
  $project: {
    ...BLOG_LIST_PROJECTION,
    has_cover_image: {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$cover_image" }, "string"] },
            { $gt: [{ $strLenCP: "$cover_image" }, 0] },
          ],
        },
        true,
        false,
      ],
    },
    cover_image: {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$cover_image" }, "string"] },
            {
              $not: [
                {
                  $regexMatch: {
                    input: "$cover_image",
                    regex: /^data:/i,
                  },
                },
              ],
            },
          ],
        },
        "$cover_image",
        null,
      ],
    },
  },
};
let blogIndexesPromise;

const normalizePublicCoverImage = (value) => {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  if (url.startsWith("data:")) return null;
  if (url.startsWith("http://")) return url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("https://") || url.startsWith("/")) return url;
  return null;
};

const serializeBlog = (doc, { publicSafe = false } = {}) => {
  if (!doc) return null;
  const {
    _id,
    published_at,
    created_at,
    updated_at,
    ...rest
  } = doc;

  return {
    id: _id.toString(),
    ...rest,
    ...(publicSafe
      ? { cover_image: normalizePublicCoverImage(rest.cover_image) }
      : {}),
    published_at: published_at ? new Date(published_at).toISOString() : null,
    created_at: created_at ? new Date(created_at).toISOString() : null,
    updated_at: updated_at ? new Date(updated_at).toISOString() : null,
  };
};

const serializeBlogs = (docs = [], options = {}) =>
  docs.map((doc) => serializeBlog(doc, options));

const getCollection = async () => {
  const db = await getDb();
  return db.collection(BLOG_COLLECTION);
};

const ensureBlogIndexes = async () => {
  if (!ENABLE_RUNTIME_INDEXING) return;

  if (!blogIndexesPromise) {
    blogIndexesPromise = (async () => {
      const collection = await getCollection();
      await Promise.all([
        collection.createIndex({ status: 1, published_at: -1 }),
        collection.createIndex({ status: 1, views: -1, likes: -1, published_at: -1 }),
        collection.createIndex({ status: 1, views: -1, published_at: -1 }),
        collection.createIndex({ slug: 1, status: 1 }),
        collection.createIndex({ updated_at: -1 }),
      ]);
    })();
  }

  return blogIndexesPromise;
};

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
};

const aggregatePublishedBlogs = async ({ sort, limit, skip }) => {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const pipeline = [
    PUBLISHED_MATCH_STAGE,
    { $sort: sort },
    BLOG_LIST_PROJECT_STAGE,
  ];

  if (typeof skip === "number" && skip > 0) {
    pipeline.push({ $skip: skip });
  }

  if (typeof limit === "number") {
    pipeline.push({ $limit: limit });
  }

  const docs = await collection
    .aggregate(pipeline, { maxTimeMS: QUERY_MAX_TIME_MS })
    .toArray();
  return serializeBlogs(docs, { publicSafe: true });
};

export async function getAllBlogs(limit) {
  return aggregatePublishedBlogs({
    sort: { published_at: -1 },
    limit: typeof limit === "number" ? limit : undefined,
  });
}

export async function getAllBlogsPage({ page = 1, limit = 24 } = {}) {
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.min(100, Math.max(1, Math.trunc(limit)));
  const skip = (safePage - 1) * safeLimit;

  // Request one extra record so we can determine if another page exists.
  const docs = await aggregatePublishedBlogs({
    sort: { published_at: -1 },
    skip,
    limit: safeLimit + 1,
  });

  const hasMore = docs.length > safeLimit;
  const items = hasMore ? docs.slice(0, safeLimit) : docs;

  return {
    items,
    page: safePage,
    limit: safeLimit,
    hasMore,
    nextPage: hasMore ? safePage + 1 : null,
  };
}

export async function getAllBlogsAdmin() {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const docs = await collection
    .find({})
    .sort({ updated_at: -1 })
    .maxTimeMS(QUERY_MAX_TIME_MS)
    .toArray();
  return serializeBlogs(docs);
}

export async function getBlogById(id) {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const doc = await collection.findOne({
    _id: objectId,
    status: "published",
  }, {
    maxTimeMS: QUERY_MAX_TIME_MS,
  });
  return serializeBlog(doc, { publicSafe: true });
}

export async function getBlogByIdAdmin(id) {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const doc = await collection.findOne(
    { _id: objectId },
    { maxTimeMS: QUERY_MAX_TIME_MS }
  );
  return serializeBlog(doc);
}

export async function getLatestBlogs(limit = 6) {
  return aggregatePublishedBlogs({
    sort: { published_at: -1 },
    limit,
  });
}

export async function getTrendingBlogs(limit = 6) {
  return aggregatePublishedBlogs({
    sort: { views: -1, likes: -1, published_at: -1 },
    limit,
  });
}

export async function getFeaturedBlog() {
  const docs = await aggregatePublishedBlogs({
    sort: { published_at: -1 },
    limit: 1,
  });
  return docs[0] || null;
}

export async function getMostViewedBlogs(limit = 6) {
  return aggregatePublishedBlogs({
    sort: { views: -1, published_at: -1 },
    limit,
  });
}

export async function getBlogFeatureSets({
  trendingLimit = 6,
  latestLimit = 12,
  mostViewedLimit = 6,
} = {}) {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const [result] = await collection
    .aggregate([
      PUBLISHED_MATCH_STAGE,
      {
        $facet: {
          featured: [
            { $sort: { published_at: -1 } },
            BLOG_LIST_PROJECT_STAGE,
            { $limit: 1 },
          ],
          trending: [
            { $sort: { views: -1, likes: -1, published_at: -1 } },
            BLOG_LIST_PROJECT_STAGE,
            { $limit: trendingLimit },
          ],
          latest: [
            { $sort: { published_at: -1 } },
            BLOG_LIST_PROJECT_STAGE,
            { $limit: latestLimit },
          ],
          mostViewed: [
            { $sort: { views: -1, published_at: -1 } },
            BLOG_LIST_PROJECT_STAGE,
            { $limit: mostViewedLimit },
          ],
        },
      },
    ], { maxTimeMS: QUERY_MAX_TIME_MS })
    .toArray();

  return {
    featured: serializeBlog(result?.featured?.[0] || null, { publicSafe: true }),
    trending: serializeBlogs(result?.trending || [], { publicSafe: true }),
    latest: serializeBlogs(result?.latest || [], { publicSafe: true }),
    mostViewed: serializeBlogs(result?.mostViewed || [], { publicSafe: true }),
  };
}

export async function getBlogBySlug(slug) {
  if (!slug) return null;
  await ensureBlogIndexes();
  const collection = await getCollection();
  const doc = await collection.findOne({
    slug,
    status: "published",
  }, {
    maxTimeMS: QUERY_MAX_TIME_MS,
  });
  return serializeBlog(doc, { publicSafe: true });
}
