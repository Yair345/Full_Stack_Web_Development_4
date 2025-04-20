// App.jsx
import { useState } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import AdvancedEditingTools from "./components/AdvancedEditingTools/AdvancedEditingTools";
import FileManager from "./components/FileManager/FileManager";
import styles from "./App.module.css";

function App() {
  const [textBlocks, setTextBlocks] = useState([]);
  const [language, setLanguage] = useState("en");
  const [currentStyle, setCurrentStyle] = useState({});
  const [history, setHistory] = useState([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);
  const [allBlocksSelected, setAllBlocksSelected] = useState(false); // New state to track if all blocks are selected

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
    setAllBlocksSelected(false); // Turn off "all blocks selected" mode when a specific block is selected

    // If a block is selected, update the current style to match
    if (index >= 0 && index < textBlocks.length) {
      setCurrentStyle(textBlocks[index].style || {});
    }
  };

  return (
    <div className={styles.container}>
      <h1>Virtual Keyboard App</h1>

      <FileManager textBlocks={textBlocks} setTextBlocks={setTextBlocks} />

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
        selectedBlockIndex={selectedBlockIndex}
        setSelectedBlockIndex={setSelectedBlockIndex}
        allBlocksSelected={allBlocksSelected}
        setAllBlocksSelected={setAllBlocksSelected}
      />

      <div className={styles.controls}>
        <SpecialButtons
          setCurrentStyle={setCurrentStyle}
          onDeleteWord={handleDeleteWord}
          onClearText={handleClearText}
          currentStyle={currentStyle}
          selectedBlockIndex={selectedBlockIndex}
          setTextBlocks={setTextBlocks}
          allBlocksSelected={allBlocksSelected}
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
