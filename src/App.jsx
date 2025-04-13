// App.jsx
import { useState } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import styles from "./App.module.css";

function App() {
  const [textBlocks, setTextBlocks] = useState([]);
  const [language, setLanguage] = useState("en");
  const [currentStyle, setCurrentStyle] = useState({});

  const handleKeyPress = (key) => {
    const newBlock = {
      text: key,
      style: currentStyle,
    };
    setTextBlocks((prev) => [...prev, newBlock]);
  };

  const handleDelete = () => {
    setTextBlocks((prev) => prev.slice(0, -1));
  };

  const handleDeleteWord = () => {
    setTextBlocks((prev) => {
      let i = prev.length - 1;
      while (i >= 0 && prev[i].text === " ") i--;
      while (i >= 0 && prev[i].text !== " ") i--;
      return prev.slice(0, i + 1);
    });
  };

  const handleClearText = () => {
    setTextBlocks([]);
  };

  const handleEnter = () => {
    const newBlock = {
      text: "\n",
      style: currentStyle,
    };
    setTextBlocks((prev) => [...prev, newBlock]);
  };

  return (
    <div className={styles.container}>
      <h1>Virtual Keyboard App</h1>
      <TextDisplay textBlocks={textBlocks} onSelectBlock={() => {}} />
      <div style={{ display: "flex", marginTop: "20px" }}>
        <div style={{ marginRight: "20px" }}>
          <SpecialButtons
            setCurrentStyle={setCurrentStyle}
            onDeleteWord={handleDeleteWord}
            onClearText={handleClearText}
          />
        </div>
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
