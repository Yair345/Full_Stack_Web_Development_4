import styles from "./TextDisplay.module.css";

function TextDisplay({ textBlocks, onSelectBlock, selectedBlockIndex }) {
  return (
    <div className={styles.textDisplay}>
      {textBlocks.map((block, index) => (
        <span
          key={index}
          style={{
            ...block.style,
            border:
              selectedBlockIndex === index ? "2px dashed #2c3e50" : "none",
            padding: selectedBlockIndex === index ? "2px" : "0",
          }}
          onClick={() => onSelectBlock(index)}
          className={styles.textBlock}
        >
          {block.text}
        </span>
      ))}
      {/* Add a blinking cursor effect */}
      <span className={styles.cursor}></span>
    </div>
  );
}

export default TextDisplay;
