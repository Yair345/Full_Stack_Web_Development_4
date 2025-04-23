import React, { useState } from 'react';
import SpecialButtons from '../SpecialButtons/SpecialButtons';
import VirtualKeyboard from '../VirtualKeyboard/VirtualKeyboard';
import styles from './InputControls.module.css';

const InputControls = ({
  textBlocks,
  setTextBlocks,
  onDeleteWord,
  onClearText,
  selectedBlockIndex,
  allBlocksSelected,
  handleKeyPress,
  handleDelete,
  handleEnter
}) => {
  // Move language state here
  const [language, setLanguage] = useState("en");
  
  // Move currentStyle state here
  const [currentStyle, setCurrentStyle] = useState({});

  return (
    <div className={styles.inputControls}>
      {/* Text Formatting Controls */}
      <SpecialButtons
        setCurrentStyle={setCurrentStyle}
        onDeleteWord={onDeleteWord}
        onClearText={onClearText}
        currentStyle={currentStyle}
        selectedBlockIndex={selectedBlockIndex}
        setTextBlocks={setTextBlocks}
        allBlocksSelected={allBlocksSelected}
        textBlocks={textBlocks}
      />

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        onKeyPress={(key) => handleKeyPress(key, currentStyle)}
        onDelete={handleDelete}
        onEnter={() => handleEnter(currentStyle)}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default InputControls;