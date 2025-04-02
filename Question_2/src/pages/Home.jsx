import React from "react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Social Media Analytics</h1>
      <nav className="bg-white p-6 rounded-lg shadow-md">
        <ul className="flex flex-col space-y-4">
          <li>
            <Link to="/top-users" className=" text-lg font-medium px-4 py-2 rounded hover:bg-blue-50 block">
              Top Users
            </Link>
          </li>
          <li>
            <Link to="/trending-posts" className=" text-lg font-medium px-4 py-2 rounded hover:bg-blue-50 block">
              Trending Posts
            </Link>
          </li>
          <li>
            <Link to="/feed" className=" text-lg font-medium px-4 py-2 rounded hover:bg-blue-50 block">
              Feed
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
