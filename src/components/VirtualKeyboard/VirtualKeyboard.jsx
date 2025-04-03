import KeyButton from "../KeyButton/KeyButton";
import styles from "./VirtualKeyboard.module.css";

const keys = {
  en: "abcdefghijklmnopqrstuvwxyz".split(""),
  he: "אבגדהוזחטיכלמנסעפצקרשת".split(""),
};

function VirtualKeyboard({ onKeyPress, language }) {
  return (
    <div className={styles.keyboard}>
      {keys[language].map((key) => (
        <KeyButton key={key} label={key} onClick={() => onKeyPress(key)} />
      ))}
    </div>
  );
}

export default VirtualKeyboard;
