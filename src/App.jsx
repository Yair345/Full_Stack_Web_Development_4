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
    setTextBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];

      if (selectionIndex !== null) {
        const selectedBlock = updatedBlocks[selectionIndex];
        
        if (JSON.stringify(selectedBlock.style) === JSON.stringify(currentStyle)) {
          updatedBlocks[selectionIndex] = {
            ...selectedBlock,
            text: selectedBlock.text + char,
          };
        } else {
          updatedBlocks.splice(selectionIndex + 1, 0, { text: char, style: currentStyle });
          setSelectionIndex(selectionIndex + 1);
        }
      } else {
        updatedBlocks.push({ text: char, style: currentStyle });
      }
      
      return updatedBlocks;
    });
  };

  const handleDelete = () => {
    setTextBlocks((prevBlocks) => {
      if (prevBlocks.length === 0) return prevBlocks;
      const updatedBlocks = [...prevBlocks];
      const lastBlock = updatedBlocks[updatedBlocks.length - 1];
      if (lastBlock.text.length > 1) {
        lastBlock.text = lastBlock.text.slice(0, -1);
      } else {
        updatedBlocks.pop();
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
      <div className={styles.controls}>
        <SpecialButtons onStyleChange={handleStyleChange} onLanguageChange={handleLanguageChange} />
        <VirtualKeyboard onKeyPress={handleTextChange} onDelete={handleDelete} language={language} />
      </div>
    </div>
  );
}

export default App;
