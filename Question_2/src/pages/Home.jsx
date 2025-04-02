import React from "react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100  justify-center p-6">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">
        Social Media Analytics
      </h1>
      <div className="h-full flex flex-col items-center">
        <nav className="bg-white p-6 rounded-lg shadow-md sm:h-[50vh] sm:w-[50vw] h-[80vh] w-[90vw]">
          <ul className="flex flex-col space-y-6 items-center">
            <li>
              <Link
                to="/top-users"
                className=" text-2xl font-medium px-4 py-2 rounded hover:bg-blue-50 block"
              >
                Top Users
              </Link>
            </li>
            <li>
              <Link
                to="/trending-posts"
                className=" text-2xl font-medium px-4 py-2 rounded hover:bg-blue-50 block"
              >
                Trending Posts
              </Link>
            </li>
            <li>
              <Link
                to="/feed"
                className=" text-2xl font-medium px-4 py-2 rounded hover:bg-blue-50 block"
              >
                Feed
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
