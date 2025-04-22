// App.jsx
import { useState, useEffect } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import DisplayManager from "./components/DisplayManager/DisplayManager";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import AdvancedEditingTools from "./components/AdvancedEditingTools/AdvancedEditingTools";
import FileManager from "./components/FileManager/FileManager";
import AuthManager from "./components/AuthManager/AuthManager";
import { getCurrentUser } from "./utils/userUtils";
import styles from "./App.module.css";

function App() {
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Array of displays, each containing text blocks
  const [displays, setDisplays] = useState([[]]);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  
  const [language, setLanguage] = useState("en");
  const [currentStyle, setCurrentStyle] = useState({});
  const [displayHistories, setDisplayHistories] = useState([[]]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);
  const [allBlocksSelected, setAllBlocksSelected] = useState(false);

  // Check login status on initial load
  useEffect(() => {
    const username = getCurrentUser();
    if (username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
  }, []);

  // Handle login status change
  const handleLoginStatusChange = (status, user) => {
    setIsLoggedIn(status);
    setCurrentUser(user);
    
    if (!status) {
      // Reset displays when logging out
      setDisplays([[]]);
      setActiveDisplayIndex(0);
      setDisplayHistories([[]]);
    }
  };

  // Helper to access current display's text blocks
  const getCurrentDisplayBlocks = () => {
    return displays[activeDisplayIndex] || [];
  };

  // Helper to update current display's text blocks
  const updateCurrentDisplayBlocks = (newBlocks) => {
    const newDisplays = [...displays];
    newDisplays[activeDisplayIndex] = newBlocks;
    setDisplays(newDisplays);
  };

  // Helper to update current display's history
  const saveToCurrentHistory = () => {
    const newDisplayHistories = [...displayHistories];
    
    // Create the history array for this display if it doesn't exist
    if (!newDisplayHistories[activeDisplayIndex]) {
      newDisplayHistories[activeDisplayIndex] = [];
    }
    
    newDisplayHistories[activeDisplayIndex] = [
      ...newDisplayHistories[activeDisplayIndex],
      [...getCurrentDisplayBlocks()]
    ];
    
    setDisplayHistories(newDisplayHistories);
  };

  const handleKeyPress = (key) => {
    const newBlock = {
      text: key,
      style: currentStyle,
    };

    // Save current state to history for undo
    saveToCurrentHistory();

    // Update the active display's text blocks
    updateCurrentDisplayBlocks([...getCurrentDisplayBlocks(), newBlock]);
  };

  const handleDelete = () => {
    const currentBlocks = getCurrentDisplayBlocks();
    if (currentBlocks.length === 0) return;

    // Save current state to history for undo
    saveToCurrentHistory();
    updateCurrentDisplayBlocks(currentBlocks.slice(0, -1));
  };

  const handleDeleteWord = () => {
    const currentBlocks = getCurrentDisplayBlocks();
    if (currentBlocks.length === 0) return;
    
    saveToCurrentHistory();
    
    let i = currentBlocks.length - 1;
    while (i >= 0 && currentBlocks[i].text === " ") i--;
    while (i >= 0 && currentBlocks[i].text !== " ") i--;
    
    updateCurrentDisplayBlocks(currentBlocks.slice(0, i + 1));
  };

  const handleClearText = () => {
    const currentBlocks = getCurrentDisplayBlocks();
    if (currentBlocks.length === 0) return;

    // Save current state to history for undo
    saveToCurrentHistory();
    updateCurrentDisplayBlocks([]);
  };

  const handleEnter = () => {
    // Save current state to history for undo
    saveToCurrentHistory();
    const newBlock = {
      text: "\n",
      style: currentStyle,
    };
    updateCurrentDisplayBlocks([...getCurrentDisplayBlocks(), newBlock]);
  };

  const handleSelectBlock = (index) => {
    setSelectedBlockIndex(index);
    setAllBlocksSelected(false);

    // If a block is selected, update the current style to match
    const currentBlocks = getCurrentDisplayBlocks();
    if (index >= 0 && index < currentBlocks.length) {
      setCurrentStyle(currentBlocks[index].style || {});
    }
  };

  // Get history for the current display
  const getCurrentHistory = () => {
    return displayHistories[activeDisplayIndex] || [];
  };

  // Set history for the current display
  const setCurrentHistory = (newHistory) => {
    const newDisplayHistories = [...displayHistories];
    newDisplayHistories[activeDisplayIndex] = newHistory;
    setDisplayHistories(newDisplayHistories);
  };

  return (
    <div className={styles.container}>
      <h1>Visual Text Editor</h1>

      {/* Authentication Component */}
      <AuthManager onLoginStatusChange={handleLoginStatusChange} />

      {/* File Management Component */}
      <FileManager 
        textBlocks={getCurrentDisplayBlocks()} 
        setTextBlocks={updateCurrentDisplayBlocks}
        isLoggedIn={isLoggedIn}
      />

      {/* Display Area */}
      <DisplayManager
        displays={displays}
        setDisplays={setDisplays}
        activeDisplayIndex={activeDisplayIndex}
        setActiveDisplayIndex={setActiveDisplayIndex}
        onSelectBlock={handleSelectBlock}
        selectedBlockIndex={selectedBlockIndex}
      />

      {/* Advanced Editing Tools */}
      <AdvancedEditingTools
        textBlocks={getCurrentDisplayBlocks()}
        setTextBlocks={updateCurrentDisplayBlocks}
        history={getCurrentHistory()}
        setHistory={setCurrentHistory}
        selectedBlockIndex={selectedBlockIndex}
        setSelectedBlockIndex={setSelectedBlockIndex}
        allBlocksSelected={allBlocksSelected}
        setAllBlocksSelected={setAllBlocksSelected}
      />

      <div className={styles.controls}>
        {/* Text Formatting Controls */}
        <SpecialButtons
          setCurrentStyle={setCurrentStyle}
          onDeleteWord={handleDeleteWord}
          onClearText={handleClearText}
          currentStyle={currentStyle}
          selectedBlockIndex={selectedBlockIndex}
          setTextBlocks={updateCurrentDisplayBlocks}
          allBlocksSelected={allBlocksSelected}
          textBlocks={getCurrentDisplayBlocks()}
        />

        {/* Virtual Keyboard */}
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