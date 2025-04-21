// DisplayManager.jsx
import { useState } from "react";
import TextDisplay from "../TextDisplay/TextDisplay";
import styles from "./DisplayManager.module.css";

function DisplayManager({
  displays,
  setDisplays,
  activeDisplayIndex,
  setActiveDisplayIndex,
  onSelectBlock,
  selectedBlockIndex,
}) {
  const addNewDisplay = () => {
    setDisplays((prev) => [...prev, []]);
    // Set the newly created display as active
    setActiveDisplayIndex(displays.length);
  };

  const removeDisplay = (indexToRemove) => {
    if (displays.length <= 1) {
      // Don't allow removing the last display
      return;
    }

    setDisplays((prev) => prev.filter((_, index) => index !== indexToRemove));

    // Update active display index if needed
    if (activeDisplayIndex === indexToRemove) {
      // If we removed the active display, set active to the previous one
      setActiveDisplayIndex(Math.max(0, indexToRemove - 1));
    } else if (activeDisplayIndex > indexToRemove) {
      // If we removed a display before the active one, decrement the active index
      setActiveDisplayIndex(activeDisplayIndex - 1);
    }
  };

  const focusDisplay = (index) => {
    setActiveDisplayIndex(index);
  };

  return (
    <div className={styles.displayManager}>
      <div className={styles.tabContainer}>
        {displays.map((_, index) => (
          <div
            key={index}
            className={`${styles.tab} ${
              activeDisplayIndex === index ? styles.activeTab : ""
            }`}
            onClick={() => focusDisplay(index)}
          >
            <span>Display {index + 1}</span>
            {displays.length > 1 && (
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  removeDisplay(index);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button className={styles.addButton} onClick={addNewDisplay}>
          +
        </button>
      </div>

      <div className={styles.displayContainer}>
        {displays.length > 0 && (
          <TextDisplay
            textBlocks={displays[activeDisplayIndex]}
            onSelectBlock={(blockIndex) => onSelectBlock(blockIndex)}
            selectedBlockIndex={selectedBlockIndex}
          />
        )}
      </div>
    </div>
  );
}

export default DisplayManager;