// DisplayManager.jsx
import { useState } from "react";
import TextDisplay from "../TextDisplay/TextDisplay";
import styles from "./DisplayManager.module.css";

function DisplayManager({
	displays,
	setDisplays,
	activeDisplayIndex,
	setActiveDisplayIndex,
	onSelectBlock,
	selectedBlockIndex,
}) {
	const addNewDisplay = () => {
		setDisplays((prev) => [...prev, []]);
		// Set the newly created display as active
		setActiveDisplayIndex(displays.length);
	};

	const removeDisplay = (indexToRemove) => {
		if (displays.length <= 1) {
			// Don't allow removing the last display
			return;
		}

		// If the display has content, suggest saving
		if (displays[indexToRemove] && displays[indexToRemove].length > 0) {
			const shouldSave = window.confirm(
				"Would you like to save this text before closing?"
			);

			if (shouldSave) {
				// Set this display as active so the user can save it using the FileManager
				setActiveDisplayIndex(indexToRemove);

				// Display a message to the user to use the save functionality
				alert(
					"Please use the Save button at the top to save your text, then close this display again."
				);

				// Exit early without removing the display
				return;
			}
		}

		// Remove the display if the user doesn't want to save or after saving
		setDisplays((prev) =>
			prev.filter((_, index) => index !== indexToRemove)
		);

		// Update active display index if needed
		if (activeDisplayIndex === indexToRemove) {
			// If we removed the active display, set active to the previous one
			setActiveDisplayIndex(Math.max(0, indexToRemove - 1));
		} else if (activeDisplayIndex > indexToRemove) {
			// If we removed a display before the active one, decrement the active index
			setActiveDisplayIndex(activeDisplayIndex - 1);
		}
	};

	const focusDisplay = (index) => {
		setActiveDisplayIndex(index);
	};

	return (
		<div className={styles.displayManager}>
			<div className={styles.displayHeader}>
				<h3>Open Documents</h3>
				<button className={styles.addButton} onClick={addNewDisplay}>
					+ Add New Document
				</button>
			</div>

			<div className={styles.displayContainer}>
				{/* Show all displays, not just the active one */}
				{console.log("displays:", displays)}
				{displays.map((display, index) => (
					<div
						key={index}
						className={`${styles.displayWrapper} ${
							activeDisplayIndex === index
								? styles.activeDisplay
								: ""
						}`}
						onClick={() =>
							index !== activeDisplayIndex && focusDisplay(index)
						}
					>
						{displays.length > 1 && (
							<button
								className={styles.closeButton}
								onClick={(e) => {
									e.stopPropagation(); // Prevent triggering the parent onClick
									removeDisplay(index);
								}}
							>
								×
							</button>
						)}
						<div className={styles.displayTitle}>
							Document {index + 1}
						</div>
						<TextDisplay
							textBlocks={display}
							onSelectBlock={(blockIndex) =>
								index === activeDisplayIndex
									? onSelectBlock(blockIndex)
									: null
							}
							selectedBlockIndex={
								index === activeDisplayIndex
									? selectedBlockIndex
									: -1
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default DisplayManager;
