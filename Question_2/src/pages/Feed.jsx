import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PostList from "../components/PostList";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      // Fetch the latest posts from the backend API
      const response = await axios.get(
        "http://localhost:5000/posts?type=latest"
      );
      console.log(response.data);

      if (response.data && response.data.latestPosts) {
        setPosts(response.data.latestPosts);
      } else {
        console.error("Unexpected API response format:", response.data);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    //  polling to fetch posts every 5 seconds
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  return (
    <div className=" p-4 ">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <PostList posts={posts} loading={loading} />
    </div>
  );
};

export default Feed;
