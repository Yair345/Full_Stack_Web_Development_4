import { useState } from "react";
import styles from "./VirtualKeyboard.module.css";

function VirtualKeyboard({ onKeyPress, onDelete, onEnter, language, setLanguage }) {
  const [shift, setShift] = useState(false);
  const [previousLang, setPreviousLang] = useState("en");

  const enLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Shift","!#1", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
    ["Emoji", "Lang", "Space", ".","Enter"]
  ];

  const heLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["/", "'", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
    ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", ","],
    ["Shift","!#1", "ז", "ס", "ב", "ה", "נ", "מ", "צ", "Backspace"],
    ["Emoji", "Lang", "Space", ".","Enter"]
  ];

  const emojiLayout = [
    ["😀", "😂", "😍", "👍", "🙏", "🔥", "🎉", "😎", "🥳", "😢"],
    ["😊", "😡", "🤔", "💡", "🎶", "📚", "💻", "📱", "🌍"],
    ["Shift", "⌫", "Backspace"],
    ["Emoji", "Lang", "Space", ".","Enter"]
  ];

  const chLayout = [
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
    [ "-", "_", "=", "+", ":", "?", "\"", "."],
    ["Shift", "⌫", "Backspace"],
    ["ABC", "Lang", "Space", "Enter"]
  ];

  const getLayout = () => {
    if (language === "emoji") return emojiLayout;
    if (language === "ch") return chLayout;
    return language === "he" ? heLayout : enLayout;
  };

  const getShiftedKey = (key) => {
    const shiftedKeys = {
      Q: "q", W: "w", E: "e", R: "r", T: "t", Y: "y", U: "u", I: "i", O: "o", P: "p",
      A: "a", S: "s", D: "d", F: "f", G: "g", H: "h", J: "j", K: "k", L: "l",
      Z: "z", X: "x", C: "c", V: "v", B: "b", N: "n", M: "m"
    };
    return shiftedKeys[key] || key;
  }

  const handleKeyClick = (key) => {
    if (key === "Shift") {
      setShift((prev) => !prev);
    } else if (key === "Backspace" || key === "⌫") {
      onDelete();
    } else if (key === "Space") {
      onKeyPress(" ");
    } else if (key === "Enter") {
      onEnter?.();
    } else if (key === "Lang") {
      if (language === "emoji") {
        setLanguage(previousLang);
      } else {
        setLanguage((prev) => {
          const next = prev === "en" ? "he" : "en";
          setPreviousLang(next);
          return next;
        });
      }
    } else if (key === "Emoji") {
      setPreviousLang(language);
      setLanguage("emoji");
    } else if (key === "ABC") {
      setLanguage(previousLang);
    } else if (key === "!#1") {
      setLanguage("ch");
    } else {
      const output = shift ? getShiftedKey(key) : key;
      onKeyPress(output);
    }
  };
  

  return (
    <div className={styles.keyboard}>
      {getLayout().map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((key) => (
            <button
              key={key}
              className={styles.key}
              data-key={key}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default VirtualKeyboard;
