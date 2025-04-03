import styles from "./TextDisplay.module.css";

function TextDisplay({ text, textStyle }) {
  return <div className={styles.textDisplay} style={textStyle}>{text}</div>;
}

export default TextDisplay;