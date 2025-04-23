/**
 * Utility functions for managing displays and their histories
 */

// Get the text blocks for the currently active display
export const getDisplayBlocks = (displays, activeIndex) => {
  return displays[activeIndex] || [];
};

// Update the text blocks for the currently active display
export const updateDisplayBlocks = (displays, activeIndex, newBlocks) => {
  const newDisplays = [...displays];
  newDisplays[activeIndex] = newBlocks;
  return newDisplays;
};

// Save the current state of a display to its history
export const saveToHistory = (displayHistories, activeIndex, currentBlocks) => {
  const newDisplayHistories = [...displayHistories];

  // Create the history array for this display if it doesn't exist
  if (!newDisplayHistories[activeIndex]) {
    newDisplayHistories[activeIndex] = [];
  }

  newDisplayHistories[activeIndex] = [
    ...newDisplayHistories[activeIndex],
    [...currentBlocks],
  ];

  return newDisplayHistories;
};

// Get the history for the currently active display
export const getDisplayHistory = (displayHistories, activeIndex) => {
  return displayHistories[activeIndex] || [];
};

// Update the history for the currently active display
export const updateDisplayHistory = (displayHistories, activeIndex, newHistory) => {
  const newDisplayHistories = [...displayHistories];
  newDisplayHistories[activeIndex] = newHistory;
  return newDisplayHistories;
};

// Reset all displays and histories (for logout)
export const resetDisplays = () => {
  return {
    displays: [[]],
    activeIndex: 0,
    histories: [[]]
  };
};