import axios from "axios";

const API_URL = "http://localhost:8000/api/education";

export const getTopics = async () => {
  const res = await axios.get(`${API_URL}/topics/`);
  return res.data;
};

export const getFeaturedArticles = async () => {
  const res = await axios.get(`${API_URL}/articles/featured/`);
  return res.data;
};

export const getArticleDetail = async (slug: string) => {
  const res = await axios.get(`${API_URL}/articles/${slug}/`);
  return res.data;
};
