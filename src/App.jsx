// App.jsx
import { useState } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import AdvancedEditingTools from "./components/AdvancedEditingTools/AdvancedEditingTools";
import styles from "./App.module.css";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  listSavedFilenames,
} from "./utils/storageUtils";

function App() {
  const [textBlocks, setTextBlocks] = useState([]);
  const [language, setLanguage] = useState("en");
  const [currentStyle, setCurrentStyle] = useState({});
  const [history, setHistory] = useState([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);

  const handleKeyPress = (key) => {
    const newBlock = {
      text: key,
      style: currentStyle,
    };

    // Save current state to history for undo
    saveToHistory();

    setTextBlocks((prev) => [...prev, newBlock]);
  };

  const handleDelete = () => {
    if (textBlocks.length === 0) return;

    // Save current state to history for undo
    saveToHistory();
    setTextBlocks((prev) => prev.slice(0, -1));
  };

  const handleDeleteWord = () => {
    if (textBlocks.length === 0) return;
    saveToHistory();
    setTextBlocks((prev) => {
      let i = prev.length - 1;
      while (i >= 0 && prev[i].text === " ") i--;
      while (i >= 0 && prev[i].text !== " ") i--;
      return prev.slice(0, i + 1);
    });
  };

  const handleClearText = () => {
    if (textBlocks.length === 0) return;

    // Save current state to history for undo
    saveToHistory();
    setTextBlocks([]);
  };

  const handleEnter = () => {
    // Save current state to history for undo
    saveToHistory();
    const newBlock = {
      text: "\n",
      style: currentStyle,
    };
    setTextBlocks((prev) => [...prev, newBlock]);
  };

  const saveToHistory = () => {
    setHistory((prev) => [...prev, [...textBlocks]]);
  };

  const handleSelectBlock = (index) => {
    setSelectedBlockIndex(index);

    // If a block is selected, update the current style to match
    if (index >= 0 && index < textBlocks.length) {
      setCurrentStyle(textBlocks[index].style || {});
    }
  };

  // Save/load from localStorage
  const handleSaveToLocalStorage = () => {
    const filename = prompt("Enter a filename to save:");
    if (filename) {
      saveToLocalStorage(filename, textBlocks);
    }
  };

  const handleLoadFromLocalStorage = (filename) => {
    if (filename) {
      const loadedBlocks = loadFromLocalStorage(filename);
      if (loadedBlocks.length) {
        saveToHistory();
        setTextBlocks(loadedBlocks);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Virtual Keyboard App</h1>

      {/* Save/load buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={handleSaveToLocalStorage}>💾 Save</button>
        <button
          onClick={() => {
            const filenames = listSavedFilenames();
            if (filenames.length === 0) {
              alert("No saved files found.");
              return;
            }
            const filename = prompt(
              `Enter filename to load:\n${filenames.join("\n")}`
            );
            if (filename) handleLoadFromLocalStorage(filename);
          }}
        >
          📂 Load
        </button>
      </div>

      <TextDisplay
        textBlocks={textBlocks}
        onSelectBlock={handleSelectBlock}
        selectedBlockIndex={selectedBlockIndex}
      />

      <AdvancedEditingTools
        textBlocks={textBlocks}
        setTextBlocks={setTextBlocks}
        history={history}
        setHistory={setHistory}
      />

      <div className={styles.controls}>
        <SpecialButtons
          setCurrentStyle={setCurrentStyle}
          onDeleteWord={handleDeleteWord}
          onClearText={handleClearText}
          currentStyle={currentStyle}
        />

        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onEnter={handleEnter}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    </div>
  );
}

export default App;
