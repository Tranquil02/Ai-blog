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
