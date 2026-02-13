
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const BLOG_COLLECTION = "blogs";
const BLOG_LIST_PROJECTION = {
  title: 1,
  slug: 1,
  excerpt: 1,
  category: 1,
  cover_image: 1,
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
const BLOG_LIST_PROJECT_STAGE = { $project: BLOG_LIST_PROJECTION };
let blogIndexesPromise;

const serializeBlog = (doc) => {
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
    published_at: published_at ? new Date(published_at).toISOString() : null,
    created_at: created_at ? new Date(created_at).toISOString() : null,
    updated_at: updated_at ? new Date(updated_at).toISOString() : null,
  };
};

const serializeBlogs = (docs = []) => docs.map(serializeBlog);

const getCollection = async () => {
  const db = await getDb();
  return db.collection(BLOG_COLLECTION);
};

const ensureBlogIndexes = async () => {
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

const aggregatePublishedBlogs = async ({ sort, limit }) => {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const pipeline = [
    PUBLISHED_MATCH_STAGE,
    { $sort: sort },
    BLOG_LIST_PROJECT_STAGE,
  ];

  if (typeof limit === "number") {
    pipeline.push({ $limit: limit });
  }

  const docs = await collection.aggregate(pipeline).toArray();
  return serializeBlogs(docs);
};

export async function getAllBlogs() {
  return aggregatePublishedBlogs({
    sort: { published_at: -1 },
  });
}

export async function getAllBlogsAdmin() {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const docs = await collection
    .find({})
    .sort({ updated_at: -1 })
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
  });
  return serializeBlog(doc);
}

export async function getBlogByIdAdmin(id) {
  await ensureBlogIndexes();
  const collection = await getCollection();
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const doc = await collection.findOne({ _id: objectId });
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
    ])
    .toArray();

  return {
    featured: serializeBlog(result?.featured?.[0] || null),
    trending: serializeBlogs(result?.trending || []),
    latest: serializeBlogs(result?.latest || []),
    mostViewed: serializeBlogs(result?.mostViewed || []),
  };
}

export async function getBlogBySlug(slug) {
  if (!slug) return null;
  await ensureBlogIndexes();
  const collection = await getCollection();
  const doc = await collection.findOne({
    slug,
    status: "published",
  });
  return serializeBlog(doc);
}
