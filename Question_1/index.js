import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
//  Middleware for logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const BASE_URL = "http://20.244.56.144/evaluation-service";

// Authentication credentials
const AUTH_CREDENTIALS = {
  email: "2206264@kiit.ac.in",
  name: "jyotiraditya",
  rollNo: "2206264",
  accessCode: "nwpwrZ",
  clientID: "4022b877-dbed-474d-a0b1-3958199f700f",
  clientSecret: "FngEBCsBvSFpsNfQ",
};

// Authentication token
let authToken = {
  token_type: "Bearer",
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTk5NjI0LCJpYXQiOjE3NDM1OTkzMjQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQwMjJiODc3LWRiZWQtNDc0ZC1hMGIxLTM5NTgxOTlmNzAwZiIsInN1YiI6IjIyMDYyNjRAa2lpdC5hYy5pbiJ9LCJlbWFpbCI6IjIyMDYyNjRAa2lpdC5hYy5pbiIsIm5hbWUiOiJqeW90aXJhZGl0eWEiLCJyb2xsTm8iOiIyMjA2MjY0IiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiNDAyMmI4NzctZGJlZC00NzRkLWEwYjEtMzk1ODE5OWY3MDBmIiwiY2xpZW50U2VjcmV0IjoiRm5nRUJDc0J2U0Zwc05mUSJ9.Oy34TSKPcoFKxjJFcsOuLf5VvvHUyq5ACJJjNcBcMtQ",
  expires_in: 1743599624,
};

// Function to authenticate with the service
async function authenticate() {
  try {
    const response = await axios.post(`${BASE_URL}/auth`, AUTH_CREDENTIALS);
    authToken = response.data;
    console.log("Authentication successful");
    return true;
  } catch (error) {
    console.error("Authentication failed:", error.message);
    return false;
  }
}

// Create an axios instance that will add the auth header to every request
const apiClient = axios.create();

// Add a request interceptor to always include the current token
apiClient.interceptors.request.use(
  async (config) => {
    // Always use the most current token
    config.headers.Authorization = `${authToken.token_type} ${authToken.access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let users = {};
let userPostCounts = {}; 
let postsWithCommentCounts = {};
let latestPosts = [];
let allPosts = {};

// For caching
let lastCacheUpdate = 0;
const TTL = 5 * 60 * 1000; // 5 min
function isCacheStale() {
  return Date.now() - lastCacheUpdate > TTL;
}
// Fetch data and Initialize it.
async function initializeData() {
  try {
    // First authenticate
    await authenticate();

    // Now fetch the data
    const usersResponse = await apiClient.get(`${BASE_URL}/users`);
    users = usersResponse.data.users;
    console.log(usersResponse.data);

    // Track user post counts and gather all posts
    const allPostsArray = [];

    // For each user, get their posts
    for (const userId in users) {
      try {
        const userPostsResponse = await apiClient.get(
          `${BASE_URL}/users/${userId}/posts`
        );
        const userPosts = userPostsResponse.data.posts || [];

        // Update post count for this user
        userPostCounts[userId] = userPosts.length; // Now matches the variable name declared above

        // Add all posts to our collection
        userPosts.forEach((post) => {
          allPostsArray.push(post);
          allPosts[post.id] = post; // Store in post cache by ID

          // Initialize comment count tracking
          postsWithCommentCounts[post.id] = 0;

          // Fetch comments for this post
          fetchComments(post.id);
        });
      } catch (error) {
        console.error(
          `Error fetching posts for user ${userId}:`,
          error.message
        );
      }
    }

    // Sort posts by ID (assuming higher ID means newer post)
    allPostsArray.sort((a, b) => b.id - a.id);

    // Keep only the latest 5 posts
    latestPosts = allPostsArray.slice(0, 5);

    // Update the cache timestamp
    lastCacheUpdate = Date.now();

    console.log("Data initialization complete");
  } catch (error) {
    console.error("Error initializing data:", error.message);
  }
}
// Fetch Comments
async function fetchComments(postId) {
  try {
    const commentsResponse = await apiClient.get(
      `${BASE_URL}/posts/${postId}/comments`
    );
    const comments = commentsResponse.data.comments || [];

    // Update comment count for this post
    postsWithCommentCounts[postId] = comments.length;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
  }
}
// for checking is refresh needed
app.use(async (req, res, next) => {
  if (isCacheStale()) {
    console.log("Cache is stale, refreshing data...");
    await initializeData();
  }
  next();
});

app.get("/users", (req, res) => {
  try {
    if (
      Object.keys(users).length === 0 ||
      Object.keys(userPostCounts).length === 0
    ) {
      return res
        .status(503)
        .json({ error: "Data is being loaded. Please try again later." });
    }

    // Sort users by post count and take top 5
    const topUsers = Object.entries(userPostCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, postCount]) => ({
        id: userId,
        name: users[userId],
        postCount,
      }));

    res.json({ topUsers });
  } catch (error) {
    console.error("Error in /users route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get posts - either popular or latest
app.get("/posts", (req, res) => {
  try {
    const type = req.query.type;

    if (!["popular", "latest"].includes(type)) {
      return res
        .status(400)
        .json({ error: 'Invalid type parameter. Use "popular" or "latest".' });
    }

    if (
      Object.keys(users).length === 0 ||
      Object.keys(postsWithCommentCounts).length === 0
    ) {
      return res
        .status(503)
        .json({ error: "Data is being loaded. Please try again later." });
    }

    if (type === "popular") {
      // Find the maximum comment count
      const commentCounts = Object.values(postsWithCommentCounts);
      const maxCommentCount =
        commentCounts.length > 0 ? Math.max(...commentCounts) : 0;

      // Get all posts with the maximum comment count
      const popularPostIds = Object.entries(postsWithCommentCounts)
        .filter(([, count]) => count === maxCommentCount)
        .map(([postId]) => parseInt(postId));

      // Get full post details for each popular post
      const popularPosts = popularPostIds
        .map((postId) => {
          const post = allPosts[postId];
          if (post) {
            return {
              ...post,
              username: users[post.userid],
              commentCount: maxCommentCount,
            };
          }
          return null;
        })
        .filter(Boolean); // Remove any null values

      res.json({ popularPosts });
    } else if (type === "latest") {
      // Add username to each post
      const latestPostsWithUsernames = latestPosts.map((post) => ({
        ...post,
        username: users[post.userid],
      }));

      res.json({ latestPosts: latestPostsWithUsernames });
    }
  } catch (error) {
    console.error("Error in /posts route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Authenticate when the server starts
(async function () {
  console.log("Authenticating with the service...");
  await authenticate();
  console.log("Initial data load...");
  await initializeData();
})();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
