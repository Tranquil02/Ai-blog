import axios from "axios";

export async function fetchFeaturedBlogs() {
  try {
    const { data } = await axios.get("/api/blog/features");
    return data;
  } catch {
    return {
      featured: null,
      trending: [],
      latest: [],
      mostViewed: [],
    };
  }
}

export async function fetchAllBlogs() {
  try {
    const { data } = await axios.get("/api/blog/getAll?limit=200");
    return data;
  } catch {
    return [];
  }
}

export async function fetchBlogsPage({ pageParam = 1, limit = 24 } = {}) {
  try {
    const { data } = await axios.get(
      `/api/blog/getAll?page=${pageParam}&limit=${limit}`
    );
    return data;
  } catch {
    return {
      items: [],
      page: pageParam,
      limit,
      hasMore: false,
      nextPage: null,
    };
  }
}
