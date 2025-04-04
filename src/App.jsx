import { useState } from "react";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import styles from "./App.module.css";

function App() {
  const [textBlocks, setTextBlocks] = useState([]);
  const [currentStyle, setCurrentStyle] = useState({ color: "black", fontSize: "16px" });
  const [language, setLanguage] = useState("en");
  const [selectionIndex, setSelectionIndex] = useState(null);

  const handleTextChange = (char) => {
    if (selectionIndex !== null) {
      // Modify selected text
      setTextBlocks((prevBlocks) => {
        const updatedBlocks = [...prevBlocks];
        updatedBlocks[selectionIndex].text += char;
        return updatedBlocks;
      });
    } else {
      // Append new styled text
      setTextBlocks((prev) => [...prev, { text: char, style: currentStyle }]);
    }
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
      <SpecialButtons onStyleChange={handleStyleChange} onLanguageChange={handleLanguageChange} />
      <VirtualKeyboard onKeyPress={handleTextChange} language={language} />
    </div>
  );
}

export default App;