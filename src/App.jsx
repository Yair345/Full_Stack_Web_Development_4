import { useState } from "react";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import VirtualKeyboard from "./components/VirtualKeyboard/VirtualKeyboard";
import SpecialButtons from "./components/SpecialButtons/SpecialButtons";
import styles from "./App.module.css";

function App() {
  const [text, setText] = useState("");
  const [textStyle, setTextStyle] = useState({ color: "black", fontSize: "16px" });
  const [language, setLanguage] = useState("en");

  const handleTextChange = (char) => {
    setText((prev) => prev + char);
  };

  const handleStyleChange = (newStyle) => {
    setTextStyle((prev) => ({ ...prev, ...newStyle }));
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  return (
    <div className={styles.container}>
      <TextDisplay text={text} textStyle={textStyle} />
      <SpecialButtons onStyleChange={handleStyleChange} onLanguageChange={handleLanguageChange} />
      <VirtualKeyboard onKeyPress={handleTextChange} language={language} />
    </div>
  );
}

export default App;