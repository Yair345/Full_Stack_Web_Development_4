import { useState } from "react";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import styles from "./App.module.css";

function App() {
  const [textBlocks, setTextBlocks] = useState([]);
  const [currentStyle, setCurrentStyle] = useState({
    color: "black",
    fontSize: "16px",
  });
  const [language, setLanguage] = useState("en");
  const [selectionIndex, setSelectionIndex] = useState(null);

  const handleTextChange = (char) => {
    setTextBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];

      if (selectionIndex !== null) {
        const selectedBlock = updatedBlocks[selectionIndex];

        if (
          JSON.stringify(selectedBlock.style) === JSON.stringify(currentStyle)
        ) {
          // If styles match, append to the same block
          updatedBlocks[selectionIndex] = {
            ...selectedBlock,
            text: selectedBlock.text + char,
          };
        } else {
          // If styles are different, create a new block
          updatedBlocks.splice(selectionIndex + 1, 0, {
            text: char,
            style: currentStyle,
          });
          setSelectionIndex(selectionIndex + 1); // Update selection to new block
        }
      } else {
        // Append new text with current style
        updatedBlocks.push({ text: char, style: currentStyle });
      }

      return updatedBlocks;
    });
  };

  const handleStyleChange = (newStyle) => {
    setCurrentStyle((prev) => ({ ...prev, ...newStyle }));
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  const handleSelectBlock = (index) => {
    setSelectionIndex(index);
  };

  return (
    <div className={styles.container}>
      <TextDisplay textBlocks={textBlocks} onSelectBlock={handleSelectBlock} />
      <SpecialButtons
        onStyleChange={handleStyleChange}
        onLanguageChange={handleLanguageChange}
      />
      <VirtualKeyboard onKeyPress={handleTextChange} language={language} />
    </div>
  );
}

export default App;
