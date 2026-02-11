
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const BLOG_COLLECTION = "blogs";

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

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
};

export async function getAllBlogs() {
  const collection = await getCollection();
  const docs = await collection
    .find({ status: "published" })
    .sort({ published_at: -1 })
    .toArray();
  return serializeBlogs(docs);
}

export async function getAllBlogsAdmin() {
  const collection = await getCollection();
  const docs = await collection
    .find({})
    .sort({ updated_at: -1 })
    .toArray();
  return serializeBlogs(docs);
}

export async function getBlogById(id) {
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
  const collection = await getCollection();
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const doc = await collection.findOne({ _id: objectId });
  return serializeBlog(doc);
}

export async function getLatestBlogs(limit = 6) {
  const collection = await getCollection();
  const docs = await collection
    .find({ status: "published" })
    .sort({ published_at: -1 })
    .limit(limit)
    .toArray();
  return serializeBlogs(docs);
}

export async function getTrendingBlogs(limit = 6) {
  const collection = await getCollection();
  const docs = await collection
    .find({ status: "published" })
    .sort({ views: -1, likes: -1, published_at: -1 })
    .limit(limit)
    .toArray();
  return serializeBlogs(docs);
}

export async function getFeaturedBlog() {
  const collection = await getCollection();
  const doc = await collection
    .find({ status: "published" })
    .sort({ published_at: -1 })
    .limit(1)
    .next();
  return serializeBlog(doc);
}

export async function getMostViewedBlogs(limit = 6) {
  const collection = await getCollection();
  const docs = await collection
    .find({ status: "published" })
    .sort({ views: -1, published_at: -1 })
    .limit(limit)
    .toArray();
  return serializeBlogs(docs);
}
