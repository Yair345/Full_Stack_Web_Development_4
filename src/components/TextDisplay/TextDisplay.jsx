import styles from "./TextDisplay.module.css";

function TextDisplay({ textBlocks, onSelectBlock }) {
  return (
    <div className={styles.textDisplay}>
      {textBlocks.map((block, index) => (
        <span
          key={index}
          style={block.style}
          onClick={() => onSelectBlock(index)}
        >
          {block.text}
        </span>
      ))}
    </div>
  );
}

export default TextDisplay;