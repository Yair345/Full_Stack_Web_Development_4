import styles from "./SpecialButtons.module.css";

function SpecialButtons({ onStyleChange, onLanguageChange }) {
  return (
    <div className={styles.specialButtons}>
      <button onClick={() => onStyleChange({ color: "blue" })}>Blue</button>
      <button onClick={() => onStyleChange({ color: "red" })}>Red</button>
      <button onClick={() => onStyleChange({ fontSize: "20px" })}>Large</button>
      <button onClick={() => onStyleChange({ fontSize: "14px" })}>Small</button>
      <button onClick={() => onLanguageChange("en")}>English</button>
      <button onClick={() => onLanguageChange("he")}>Hebrew</button>
    </div>
  );
}

export default SpecialButtons;
