import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:bg-blue-50 transition-shadow hover:shadow-md">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.username}</p>
      <p className="text-gray-500">{user.email}</p>
      <p className="text-gray-400">{user.postsCount} Posts</p>
    </div>
  );
};

export default UserCard;