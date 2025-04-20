import React from "react";
import styles from "./SpecialButtons.module.css";

function SpecialButtons({
  setCurrentStyle,
  onDeleteWord,
  onClearText,
  currentStyle,
}) {
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
  const fonts = [
    "Arial",
    "Times New Roman",
    "Tahoma",
    "Verdana",
    "Courier New",
  ];

  const handleStyleChange = (key, value) => {
    setCurrentStyle((prev) => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (styleKey, activeValue, inactiveValue = "normal") => {
    setCurrentStyle((prev) => ({
      ...prev,
      [styleKey]: prev[styleKey] === activeValue ? inactiveValue : activeValue,
    }));
  };

  // Helper function to determine if a style is active
  const isStyleActive = (styleKey, activeValue) => {
    return currentStyle && currentStyle[styleKey] === activeValue;
  };

  return (
    <div className={styles.specialButtons}>
      <div className={styles.colorContainer}>
        <label>
          צבע טקסט:
          <input
            type="color"
            onChange={(e) => handleStyleChange("color", e.target.value)}
            value={currentStyle.color || "#000000"}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div className={styles.fontContainer}>
        <label>
          גודל טקסט:
          <select
            onChange={(e) =>
              handleStyleChange("fontSize", `${e.target.value}px`)
            }
            value={(currentStyle.fontSize || "16px").replace("px", "")}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.fontContainer}>
        <label>
          סוג פונט:
          <select
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            value={currentStyle.fontFamily || "Arial"}
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.specialButtons}>
        <button
          onClick={() => toggleStyle("fontWeight", "bold")}
          className={isStyleActive("fontWeight", "bold") ? styles.blue : ""}
        >
          B
        </button>
        <button
          onClick={() => toggleStyle("fontStyle", "italic")}
          className={isStyleActive("fontStyle", "italic") ? styles.blue : ""}
        >
          I
        </button>
        <button
          onClick={() => toggleStyle("textDecoration", "underline")}
          className={
            isStyleActive("textDecoration", "underline") ? styles.blue : ""
          }
        >
          U
        </button>
      </div>

      <div className={styles.specialButtons}>
        <button onClick={onDeleteWord} className={styles.red}>
          מחק מילה
        </button>
        <button onClick={onClearText} className={styles.red}>
          מחק הכל
        </button>
      </div>
    </div>
  );
}

export default SpecialButtons;
