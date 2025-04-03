import styles from "./KeyButton.module.css";

function KeyButton({ label, onClick }) {
  return (
    <button className={styles.keyButton} onClick={onClick}>
      {label}
    </button>
  );
}

export default KeyButton;