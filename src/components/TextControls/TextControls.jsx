import React, { useState } from 'react';
import AdvancedEditingTools from '../AdvancedEditingTools/AdvancedEditingTools';
import InputControls from '../InputControls/InputControls';
import styles from './TextControls.module.css';

const TextControls = ({
  textBlocks,
  setTextBlocks,
  history,
  setHistory,
  saveToHistory,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);
  const [allBlocksSelected, setAllBlocksSelected] = useState(false);
  
  // Helper functions for text manipulation
  const handleDeleteWord = () => {
    if (textBlocks.length === 0) return;

    saveToHistory();

    let i = textBlocks.length - 1;
    while (i >= 0 && textBlocks[i].text === " ") i--;
    while (i >= 0 && textBlocks[i].text !== " ") i--;

    setTextBlocks(textBlocks.slice(0, i + 1));
  };

  const handleClearText = () => {
    if (textBlocks.length === 0) return;

    saveToHistory();
    setTextBlocks([]);
  };

  const handleKeyPress = (key, style) => {
    const newBlock = {
      text: key,
      style: style,
    };

    saveToHistory();
    setTextBlocks([...textBlocks, newBlock]);
  };

  const handleDelete = () => {
    if (textBlocks.length === 0) return;

    saveToHistory();
    setTextBlocks(textBlocks.slice(0, -1));
  };

  const handleEnter = (style) => {
    saveToHistory();
    const newBlock = {
      text: "\n",
      style: style,
    };
    setTextBlocks([...textBlocks, newBlock]);
  };

  return (
    <div className={styles.textControls}>
      {/* Advanced Editing Tools */}
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

      {/* Input Controls */}
      <InputControls 
        textBlocks={textBlocks}
        setTextBlocks={setTextBlocks}
        onDeleteWord={handleDeleteWord}
        onClearText={handleClearText}
        selectedBlockIndex={selectedBlockIndex}
        allBlocksSelected={allBlocksSelected}
        handleKeyPress={handleKeyPress}
        handleDelete={handleDelete}
        handleEnter={handleEnter}
      />
    </div>
  );
};

export default TextControls;