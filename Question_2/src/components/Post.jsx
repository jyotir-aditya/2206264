import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{post.username || "Unknown User"}</h3>
        <span className="text-sm text-gray-500">Post ID: {post.id}</span>
      </div>
      <p className="mb-2 text-gray-800">{post.content}</p>
      <div className="flex items-center justify-between mt-3 text-sm">
        {/* Add Design if time allows */}
        <span className="">User ID: {post.userid}</span>
      </div>
    </div>
  );
};
export default Post;