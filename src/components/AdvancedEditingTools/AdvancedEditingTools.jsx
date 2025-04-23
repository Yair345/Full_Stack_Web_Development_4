import { useState } from "react";
import styles from "./AdvancedEditingTools.module.css";

function AdvancedEditingTools({
	textBlocks,
	setTextBlocks,
	history,
	setHistory,
	selectedBlockIndex,
	setSelectedBlockIndex,
	allBlocksSelected,
	setAllBlocksSelected,
}) {
	const [searchText, setSearchText] = useState("");
	const [replaceText, setReplaceText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [currentResultIndex, setCurrentResultIndex] = useState(-1);

	// Convert textBlocks to a single string for searching
	const getFullText = () => {
		return textBlocks.map((block) => block.text).join("");
	};

	const handleSearch = () => {
		if (!searchText) return;

		const fullText = getFullText();
		const results = [];
		let index = -1;

		while ((index = fullText.indexOf(searchText, index + 1)) !== -1) {
			results.push(index);
		}

		setSearchResults(results);
		setCurrentResultIndex(results.length > 0 ? 0 : -1);

		// Highlight the first result if any
		if (results.length > 0) {
			highlightResult(results[0]);
		}
	};

	const highlightResult = (startIndex) => {
		// Implementation would depend on how you want to highlight the results
		// This is a simplified approach
		const updatedBlocks = [...textBlocks];

		// Reset all highlights first
		updatedBlocks.forEach((block) => {
			if (block.style && block.style.backgroundColor === "yellow") {
				const { backgroundColor, ...restStyle } = block.style;
				block.style = restStyle;
			}
		});

		// Find the blocks that contain the search result and highlight them
		let currentIndex = 0;
		for (let i = 0; i < updatedBlocks.length; i++) {
			const block = updatedBlocks[i];
			const blockLength = block.text.length;

			if (
				currentIndex <= startIndex &&
				startIndex < currentIndex + blockLength
			) {
				// This block contains the start of the search result
				updatedBlocks[i] = {
					...block,
					style: { ...block.style, backgroundColor: "yellow" },
				};

				// Highlight additional blocks if the search text spans multiple blocks
				const endIndex = startIndex + searchText.length - 1;
				if (endIndex >= currentIndex + blockLength) {
					let j = i + 1;
					while (
						j < updatedBlocks.length &&
						currentIndex + blockLength <= endIndex
					) {
						updatedBlocks[j] = {
							...updatedBlocks[j],
							style: {
								...updatedBlocks[j].style,
								backgroundColor: "yellow",
							},
						};
						currentIndex += updatedBlocks[j].text.length;
						j++;
					}
				}
				break;
			}

			currentIndex += blockLength;
		}

		setTextBlocks(updatedBlocks);
	};

	const handleReplaceAll = () => {
		if (!searchText) return;

		// Save current state for undo
		saveToHistory();

		const fullText = getFullText();
		if (!fullText.includes(searchText)) return;

		// Create a new array of text blocks with replacements
		let currentIndex = 0;
		let newBlocks = [];

		textBlocks.forEach((block) => {
			const blockText = block.text;
			const blockStyle = block.style;

			if (blockText.includes(searchText)) {
				// This block contains the search text
				const parts = blockText.split(searchText);

				for (let i = 0; i < parts.length; i++) {
					if (parts[i]) {
						newBlocks.push({ text: parts[i], style: blockStyle });
					}

					if (i < parts.length - 1) {
						// Add replacement text with the same style
						newBlocks.push({
							text: replaceText,
							style: blockStyle,
						});
					}
				}
			} else {
				// This block doesn't contain the search text
				newBlocks.push(block);
			}
		});

		setTextBlocks(newBlocks);
		setSearchResults([]);
		setCurrentResultIndex(-1);
	};

	const handleReplaceCurrent = () => {
		if (currentResultIndex === -1 || !searchResults.length) return;

		// Save current state for undo
		saveToHistory();

		const startIndex = searchResults[currentResultIndex];
		const fullText = getFullText();

		// Create new text blocks with the replacement
		let currentIndex = 0;
		let newBlocks = [];

		for (let i = 0; i < textBlocks.length; i++) {
			const block = textBlocks[i];
			const blockText = block.text;
			const blockStyle = block.style;
			const blockLength = blockText.length;

			if (
				currentIndex <= startIndex &&
				startIndex < currentIndex + blockLength
			) {
				// This block contains the start of the search result
				const offsetInBlock = startIndex - currentIndex;

				// Add text before the match
				if (offsetInBlock > 0) {
					newBlocks.push({
						text: blockText.substring(0, offsetInBlock),
						style: blockStyle,
					});
				}

				// Add replacement text
				newBlocks.push({
					text: replaceText,
					style: blockStyle,
				});

				// Check if the search text spans multiple blocks
				const endIndex = startIndex + searchText.length - 1;

				if (endIndex < currentIndex + blockLength) {
					// The search text is contained within this block
					// Add the remaining text in this block
					const remainingText = blockText.substring(
						offsetInBlock + searchText.length
					);
					if (remainingText) {
						newBlocks.push({
							text: remainingText,
							style: blockStyle,
						});
					}

					// Add all subsequent blocks
					newBlocks = [...newBlocks, ...textBlocks.slice(i + 1)];
				} else {
					// The search text spans multiple blocks
					let j = i + 1;
					let charactersToSkip =
						currentIndex + blockLength - startIndex;

					while (j < textBlocks.length) {
						const nextBlock = textBlocks[j];
						const nextBlockLength = nextBlock.text.length;

						if (
							charactersToSkip + nextBlockLength >
							searchText.length
						) {
							// This block contains the end of the search text
							const remainingText = nextBlock.text.substring(
								searchText.length - charactersToSkip
							);
							if (remainingText) {
								newBlocks.push({
									text: remainingText,
									style: nextBlock.style,
								});
							}

							// Add all subsequent blocks
							newBlocks = [
								...newBlocks,
								...textBlocks.slice(j + 1),
							];
							break;
						}

						charactersToSkip += nextBlockLength;
						j++;
					}
				}

				break;
			} else {
				// This block is before the search result
				newBlocks.push(block);
			}

			currentIndex += blockLength;
		}

		setTextBlocks(newBlocks);

		// Update search results
		const updatedResults = searchResults.filter(
			(_, index) => index !== currentResultIndex
		);
		setSearchResults(updatedResults);
		if (updatedResults.length > 0) {
			setCurrentResultIndex(currentResultIndex % updatedResults.length);
		} else {
			setCurrentResultIndex(-1);
		}
	};

	const navigateResults = (direction) => {
		if (!searchResults.length) return;

		const newIndex =
			(currentResultIndex + direction + searchResults.length) %
			searchResults.length;
		setCurrentResultIndex(newIndex);
		highlightResult(searchResults[newIndex]);
	};

	const saveToHistory = () => {
		setHistory([...history, [...textBlocks]]);
	};

	const handleUndo = () => {
		if (!history || history.length === 0) return;

		// Get the previous state from history
		const previousState = history[history.length - 1];
		
		// Update the text blocks with the previous state
		setTextBlocks(previousState);
		
		// Remove the last state from history
		setHistory(history.slice(0, -1));
	};

	const handleSelectAll = () => {
		// Save current state for undo
		saveToHistory();

		// Apply a highlight style to all blocks
		const updatedBlocks = textBlocks.map((block) => ({
			...block,
			style: { ...block.style, backgroundColor: "lightblue" },
		}));

		setTextBlocks(updatedBlocks);

		// Set the all blocks selected flag to true
		setAllBlocksSelected(true);

		// Select the first block (for showing what style is currently selected)
		if (textBlocks.length > 0) {
			setSelectedBlockIndex(0);
		}
	};

	const handleUnSelectAll = () => {
		// Save current state for undo
		saveToHistory();

		const updatedBlocks = textBlocks.map((block) => {
			const { backgroundColor, ...restStyle } = block.style || {};
			return { ...block, style: restStyle };
		});
		setTextBlocks(updatedBlocks);

		// Turn off the all blocks selected flag
		setAllBlocksSelected(false);

		// Deselect all blocks
		setSelectedBlockIndex(-1);
	};

	const handleChangeCase = (caseType) => {
		// Save current state for undo
		saveToHistory();

		const updatedBlocks = textBlocks.map((block) => {
			let newText;

			switch (caseType) {
				case "upper":
					newText = block.text.toUpperCase();
					break;
				case "lower":
					newText = block.text.toLowerCase();
					break;
				default:
					newText = block.text;
			}

			return { ...block, text: newText };
		});

		setTextBlocks(updatedBlocks);
	};

	return (
		<div className={styles.advancedTools}>
			<div className={styles.searchReplaceContainer}>
				<div className={styles.searchContainer}>
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="search for text"
						className={styles.input}
					/>
					<button onClick={handleSearch} className={styles.button}>
						search
					</button>
					{searchResults.length > 0 && (
						<>
							<button
								onClick={() => navigateResults(-1)}
								className={styles.button}
							>
								previous
							</button>
							<span className={styles.resultCount}>{`${
								currentResultIndex + 1
							}/${searchResults.length}`}</span>
							<button
								onClick={() => navigateResults(1)}
								className={styles.button}
							>
								next
							</button>
						</>
					)}
				</div>

				<div className={styles.replaceContainer}>
					<input
						type="text"
						value={replaceText}
						onChange={(e) => setReplaceText(e.target.value)}
						placeholder="replace with"
						className={styles.input}
					/>
					<button
						onClick={handleReplaceCurrent}
						className={styles.button}
					>
						replace
					</button>
					<button
						onClick={handleReplaceAll}
						className={styles.button}
					>
						replace all
					</button>
				</div>
			</div>

			<div className={styles.editToolsContainer}>
				<button
					onClick={handleUndo}
					className={`${styles.button} ${styles.blue}`}
				>
					Undo
				</button>
				<button
					onClick={handleSelectAll}
					className={`${styles.button} ${styles.large}`}
				>
					Select All
				</button>
				<button
					onClick={handleUnSelectAll}
					className={`${styles.button} ${styles.cancelSelection}`}
				>
					Cancel Selection
				</button>
				<button
					onClick={() => handleChangeCase("upper")}
					className={`${styles.button} ${styles.english}`}
				>
					Uppercase Letters
				</button>
				<button
					onClick={() => handleChangeCase("lower")}
					className={`${styles.button} ${styles.small}`}
				>
					Lowercase Letters
				</button>
			</div>
		</div>
	);
}

export default AdvancedEditingTools;
