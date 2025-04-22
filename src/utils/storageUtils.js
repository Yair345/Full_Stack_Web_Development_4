// storageUtils.js
import { getCurrentUser } from './userUtils';

const BASE_PREFIX = "textEditor_";
const FILE_PREFIX = "file_";
const USER_FILES_LIST = "files_list";

// Get the complete key for a file, including user prefix
const getFileKey = (filename) => {
  const username = getCurrentUser();
  if (!username) {
    throw new Error("No user logged in");
  }
  return `${BASE_PREFIX}${username}_${FILE_PREFIX}${filename}`;
};

// Get the key for the user's file list
const getUserFilesListKey = () => {
  const username = getCurrentUser();
  if (!username) {
    throw new Error("No user logged in");
  }
  return `${BASE_PREFIX}${username}_${USER_FILES_LIST}`;
};

// Add a filename to the user's file list
const addToUserFilesList = (filename) => {
  try {
    const listKey = getUserFilesListKey();
    const existingListJson = localStorage.getItem(listKey);
    let filesList = existingListJson ? JSON.parse(existingListJson) : [];

    // Add the file if it's not already in the list
    if (!filesList.includes(filename)) {
      filesList.push(filename);
      localStorage.setItem(listKey, JSON.stringify(filesList));
    }
  } catch (err) {
    console.error("Error updating user's file list", err);
  }
};

// Remove a filename from the user's file list
const removeFromUserFilesList = (filename) => {
  try {
    const listKey = getUserFilesListKey();
    const existingListJson = localStorage.getItem(listKey);
    let filesList = existingListJson ? JSON.parse(existingListJson) : [];

    // Remove the file from the list
    filesList = filesList.filter(name => name !== filename);
    localStorage.setItem(listKey, JSON.stringify(filesList));
  } catch (err) {
    console.error("Error removing from user's file list", err);
  }
};

export const saveToLocalStorage = (filename, data) => {
  if (!filename || !data) return { success: false, message: "Filename and data are required" };

  try {
    const username = getCurrentUser();
    if (!username) {
      return { success: false, message: "Please log in to save files" };
    }

    const key = getFileKey(filename);
    const existing = localStorage.getItem(key);

    if (existing && !window.confirm(`"${filename}" already exists. Overwrite?`)) {
      return { success: false, message: "Save cancelled" };
    }

    localStorage.setItem(key, JSON.stringify(data));

    // Update the user's file list
    addToUserFilesList(filename);

    return { success: true, message: `Saved as "${filename}"` };
  } catch (err) {
    console.error("Error saving to localStorage", err);
    return { success: false, message: "Error saving file: " + err.message };
  }
};

export const loadFromLocalStorage = (filename) => {
  if (!filename) return [];

  try {
    const username = getCurrentUser();
    if (!username) {
      throw new Error("Please log in to load files");
    }

    const key = getFileKey(filename);
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("Error loading from localStorage", err);
    return [];
  }
};

export const listSavedFilenames = () => {
  try {
    const username = getCurrentUser();
    if (!username) {
      return []; // Return empty array if no user is logged in
    }

    const listKey = getUserFilesListKey();
    const json = localStorage.getItem(listKey);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("Error listing files", err);
    return [];
  }
};

export const deleteFile = (filename) => {
  if (!filename) return { success: false, message: "Filename is required" };

  try {
    const username = getCurrentUser();
    if (!username) {
      return { success: false, message: "Please log in to delete files" };
    }

    const key = getFileKey(filename);

    if (!localStorage.getItem(key)) {
      return { success: false, message: `File "${filename}" not found` };
    }

    localStorage.removeItem(key);

    // Update the user's file list
    removeFromUserFilesList(filename);

    return { success: true, message: `File "${filename}" deleted successfully` };
  } catch (err) {
    console.error("Error deleting file", err);
    return { success: false, message: "Error deleting file: " + err.message };
  }
};