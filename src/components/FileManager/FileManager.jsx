// FileManager.jsx
import { useState, useEffect } from "react";
import styles from "./FileManager.module.css";
import {
	saveToLocalStorage,
	loadFromLocalStorage,
	listSavedFilenames,
	deleteFile,
} from "../../utils/storageUtils";
import { getCurrentUser } from "../../utils/userUtils";

function FileManager({ textBlocks, setTextBlocks, isLoggedIn }) {
	const [filename, setFilename] = useState("");
	const [availableFiles, setAvailableFiles] = useState([]);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState(""); // For styling: "success" or "error"

	// Refresh file list when login status changes or component mounts
	useEffect(() => {
		refreshFileList();
	}, [isLoggedIn]);

	const refreshFileList = () => {
		setAvailableFiles(listSavedFilenames());
	};

	const displayMessage = (msg, type = "info") => {
		setMessage(msg);
		setMessageType(type);

		// Clear message after 3 seconds
		setTimeout(() => {
			setMessage("");
			setMessageType("");
		}, 3000);
	};

	const handleSave = () => {
		if (!isLoggedIn) {
			displayMessage("Please log in to save files", "error");
			return;
		}

		if (!filename) {
			displayMessage("Please enter a filename", "error");
			return;
		}

		if (textBlocks.length === 0) {
			displayMessage("There is no text to save", "error");
			return;
		}

		const result = saveToLocalStorage(filename, textBlocks);

		if (result.success) {
			displayMessage(result.message, "success");
			refreshFileList();
		} else {
			displayMessage(result.message, "error");
		}
	};

	const handleLoad = () => {
		if (!isLoggedIn) {
			displayMessage("Please log in to load files", "error");
			return;
		}

		if (!filename) {
			displayMessage("Please enter a filename to load", "error");
			return;
		}

		try {
			const loaded = loadFromLocalStorage(filename);
			if (loaded.length === 0) {
				displayMessage("No such file or file is empty", "error");
				return;
			}

			setTextBlocks(loaded);
			displayMessage(`File "${filename}" loaded successfully`, "success");
		} catch (error) {
			displayMessage(error.message, "error");
		}
	};

	const handleDelete = () => {
		if (!isLoggedIn) {
			displayMessage("Please log in to delete files", "error");
			return;
		}

		if (!filename) {
			displayMessage("Please enter a filename to delete", "error");
			return;
		}

		if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
			const result = deleteFile(filename);

			if (result.success) {
				displayMessage(result.message, "success");
				refreshFileList();

				// Clear filename if the deleted file was selected
				setFilename("");
			} else {
				displayMessage(result.message, "error");
			}
		}
	};

	// If not logged in, show minimal interface
	if (!isLoggedIn) {
		return (
			<div className={styles.fileManager}>
				<div className={`${styles.message} ${styles.error}`}>
					Please log in to manage files
				</div>
			</div>
		);
	}

	return (
		<div className={styles.fileManager}>
			<div className={styles.fileControls}>
				<input
					type="text"
					placeholder="Filename"
					value={filename}
					onChange={(e) => setFilename(e.target.value)}
					className={styles.input}
				/>
				<div className={styles.buttonGroup}>
					<button onClick={handleSave} className={styles.button}>
						💾 Save
					</button>
					<button onClick={handleLoad} className={styles.button}>
						📂 Load
					</button>
					<button
						onClick={handleDelete}
						className={`${styles.button} ${styles.deleteButton}`}
					>
						🗑️ Delete
					</button>
				</div>
			</div>

			{message && (
				<div className={`${styles.message} ${styles[messageType]}`}>
					{message}
				</div>
			)}

			{availableFiles.length > 0 && (
				<div className={styles.savedFiles}>
					<strong>Your Files:</strong>
					<ul className={styles.fileList}>
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
