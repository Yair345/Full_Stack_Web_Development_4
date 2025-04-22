// userUtils.js - Functions for user management

const USER_PREFIX = "textEditor_user_";
const CURRENT_USER_KEY = "textEditor_currentUser";

// User registration
export const registerUser = (username, password) => {
  const userKey = `${USER_PREFIX}${username}`;

  // Check if user already exists
  if (localStorage.getItem(userKey)) {
    return { success: false, message: "Username already exists. Please choose a different one." };
  }

  // Store user data
  const userData = {
    username,
    password,
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(userKey, JSON.stringify(userData));
    return { success: true, message: "Registration successful! Please log in." };
  } catch (err) {
    console.error("Error registering user", err);
    return { success: false, message: "Registration failed. Please try again." };
  }
};

// User login
export const loginUser = (username, password) => {
  const userKey = `${USER_PREFIX}${username}`;

  // Get user data
  try {
    const userData = localStorage.getItem(userKey);
    if (!userData) {
      return { success: false, message: "User not found. Please check your username." };
    }

    const user = JSON.parse(userData);

    // Check password
    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true, message: "Login successful!", user: { username: user.username } };

  } catch (err) {
    console.error("Error logging in", err);
    return { success: false, message: "Login failed. Please try again." };
  }
};

// Check if user is logged in
export const getCurrentUser = () => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true, message: "Logout successful!" };
};

// List all registered users (for admin purposes)
export const listUsers = () => {
  const users = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(USER_PREFIX)) {
      users.push(key.replace(USER_PREFIX, ""));
    }
  }

  return users;
};