import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import axios from "axios";
// import UserCard from '../components/users/UserCard';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        const users = await axios.get("http://localhost:5000/users");
        console.log(users.data.topUsers);
        setTopUsers(users.data.topUsers);
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };

    getTopUsers();
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
      <h1 className="text-3xl">Top Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5 ">
        {topUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
