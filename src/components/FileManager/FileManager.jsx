import { useState } from "react";
import styles from "./FileManager.module.css";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  listSavedFilenames,
} from "../../utils/storageUtils";

function FileManager({ textBlocks, setTextBlocks }) {
  const [filename, setFilename] = useState("");
  const [availableFiles, setAvailableFiles] = useState(listSavedFilenames());

  const handleSave = () => {
    if (!filename) return alert("Please enter a filename");
    saveToLocalStorage(filename, textBlocks);
    setAvailableFiles(listSavedFilenames());
  };

  const handleLoad = () => {
    if (!filename) return alert("Please enter a filename to load");
    const loaded = loadFromLocalStorage(filename);
    if (loaded.length === 0) {
      alert("No such file or file is empty");
    }
    setTextBlocks(loaded);
  };

  return (
    <div className={styles.fileManager}>
      <input
        type="text"
        placeholder="Filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSave} className={styles.button}>
        💾 Save
      </button>
      <button onClick={handleLoad} className={styles.button}>
        📂 Load
      </button>

      {availableFiles.length > 0 && (
        <div className={styles.savedFiles}>
          <strong>Saved Files:</strong>
          <ul>
            {availableFiles.map((name) => (
              <li
                key={name}
                className={styles.fileName}
                onClick={() => setFilename(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileManager;
