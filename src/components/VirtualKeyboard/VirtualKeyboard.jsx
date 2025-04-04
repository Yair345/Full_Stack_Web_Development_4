import KeyButton from "../KeyButton/KeyButton";
import styles from "./VirtualKeyboard.module.css";

function VirtualKeyboard({ onKeyPress, onDelete, language }) {
  const keys =
    language === "en"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
      : "אבגדהוזחטיכלמנסעפצקרשת".split("");
  return (
    <div className={styles.keyboard}>
      {keys.map((key) => (
        <button
          key={key}
          className={styles.key}
          onClick={() => onKeyPress(key)}
        >
          {key}
        </button>
      ))}
      <button className={styles.key} onClick={() => onKeyPress(" ")}>
        Space
      </button>
      <button className={styles.key} onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default VirtualKeyboard;
