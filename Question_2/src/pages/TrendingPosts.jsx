import React, { useEffect, useState } from "react";
import axios from "axios";
import PostList from "../components/PostList";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const data = await axios.get(
          `http://localhost:5000/posts?type=popular`
        );
        console.log(data.data.popularPosts);
        setPosts(data.data.popularPosts);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl">Trending Posts</h1>
      <PostList posts={posts} />
    </div>
  );
};

export default TrendingPosts;
