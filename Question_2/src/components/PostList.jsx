import React from "react";
import Post from "./Post";

const PostList = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-4">No posts available</div>;
  }

  return (
    <div className="mt-4 ">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
