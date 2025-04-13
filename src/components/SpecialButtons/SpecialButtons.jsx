// SpecialButtons.jsx
import React from "react";

function SpecialButtons({ setCurrentStyle, onDeleteWord, onClearText }) {
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
  const fonts = ["Arial", "Times New Roman", "Tahoma", "Verdana", "Courier New"];

  const handleStyleChange = (key, value) => {
    setCurrentStyle((prev) => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (styleKey, activeValue, inactiveValue = "normal") => {
    setCurrentStyle((prev) => ({
      ...prev,
      [styleKey]: prev[styleKey] === activeValue ? inactiveValue : activeValue,
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label>
        צבע טקסט:
        <input type="color" onChange={(e) => handleStyleChange("color", e.target.value)} style={{ marginLeft: "10px" }} />
      </label>

      <label>
        גודל טקסט:
        <select onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)} defaultValue="16">
          {fontSizes.map((size) => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </label>

      <label>
        סוג פונט:
        <select onChange={(e) => handleStyleChange("fontFamily", e.target.value)} defaultValue="Arial">
          {fonts.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </label>

      <div>
        <button onClick={() => toggleStyle("fontWeight", "bold")}>B</button>
        <button onClick={() => toggleStyle("fontStyle", "italic")}>I</button>
        <button onClick={() => toggleStyle("textDecoration", "underline")}>U</button>
      </div>

      <div>
        <button onClick={onDeleteWord}>מחק מילה</button>
        <button onClick={onClearText}>מחק הכל</button>
      </div>
    </div>
  );
}

export default SpecialButtons;
