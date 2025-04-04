import styles from "./SpecialButtons.module.css";

function SpecialButtons({ onStyleChange, onLanguageChange }) {
  return (
    <div className={styles.specialButtons}>
      <button className={styles.blue} onClick={() => onStyleChange({ color: "blue" })}>Blue</button>
      <button className={styles.red} onClick={() => onStyleChange({ color: "red" })}>Red</button>
      <button className={styles.large} onClick={() => onStyleChange({ fontSize: "20px" })}>Large</button>
      <button className={styles.small} onClick={() => onStyleChange({ fontSize: "14px" })}>Small</button>
      <button className={styles.english} onClick={() => onLanguageChange("en")}>English</button>
      <button className={styles.hebrew} onClick={() => onLanguageChange("he")}>Hebrew</button>
    </div>
  );
}

export default SpecialButtons;
