import React from "react";
import styles from "./SpecialButtons.module.css";

function SpecialButtons({
	setCurrentStyle,
	onDeleteWord,
	onClearText,
	currentStyle,
	selectedBlockIndex,
	setTextBlocks,
	allBlocksSelected,
	textBlocks,
}) {
	const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
	const fonts = [
		"Arial",
		"Times New Roman",
		"Tahoma",
		"Verdana",
		"Courier New",
	];

	const handleStyleChange = (key, value) => {
		// Update current style
		setCurrentStyle((prev) => ({ ...prev, [key]: value }));

		// If all blocks are selected, update all blocks
		if (allBlocksSelected) {
			setTextBlocks((prev) => {
				return prev.map((block) => ({
					...block,
					style: {
						...block.style,
						[key]: value,
					},
				}));
			});
		}
		// Otherwise, update just the selected block if a block is selected
		else if (
			selectedBlockIndex >= 0 &&
			textBlocks &&
			textBlocks.length > 0
		) {
			setTextBlocks((prev) => {
				const newBlocks = [...prev];
				if (newBlocks[selectedBlockIndex]) {
					newBlocks[selectedBlockIndex] = {
						...newBlocks[selectedBlockIndex],
						style: {
							...newBlocks[selectedBlockIndex].style,
							[key]: value,
						},
					};
				}
				return newBlocks;
			});
		}
	};

	const toggleStyle = (styleKey, activeValue, inactiveValue = "normal") => {
		// Determine the new value based on current state
		const newValue = isStyleActive(styleKey, activeValue)
			? inactiveValue
			: activeValue;

		// Update current style
		setCurrentStyle((prev) => ({
			...prev,
			[styleKey]: newValue,
		}));

		// If all blocks are selected, update all blocks
		if (allBlocksSelected) {
			setTextBlocks((prev) => {
				return prev.map((block) => ({
					...block,
					style: {
						...block.style,
						[styleKey]: newValue,
					},
				}));
			});
		}
		// Otherwise, update just the selected block if a block is selected
		else if (
			selectedBlockIndex >= 0 &&
			textBlocks &&
			textBlocks.length > 0
		) {
			setTextBlocks((prev) => {
				const newBlocks = [...prev];
				if (newBlocks[selectedBlockIndex]) {
					newBlocks[selectedBlockIndex] = {
						...newBlocks[selectedBlockIndex],
						style: {
							...newBlocks[selectedBlockIndex].style,
							[styleKey]: newValue,
						},
					};
				}
				return newBlocks;
			});
		}
	};

	// Helper function to determine if a style is active
	const isStyleActive = (styleKey, activeValue) => {
		return currentStyle && currentStyle[styleKey] === activeValue;
	};

	return (
		<div className={styles.specialButtons}>
			<div className={styles.colorContainer}>
				<label>
					Text Color:
					<input
						type="color"
						onChange={(e) =>
							handleStyleChange("color", e.target.value)
						}
						value={currentStyle.color || "#000000"}
						style={{ marginLeft: "10px" }}
					/>
				</label>
			</div>

			<div className={styles.fontContainer}>
				<label>
					Text Size:
					<select
						onChange={(e) =>
							handleStyleChange("fontSize", `${e.target.value}px`)
						}
						value={(currentStyle.fontSize || "16px").replace(
							"px",
							""
						)}
					>
						{fontSizes.map((size) => (
							<option key={size} value={size}>
								{size}px
							</option>
						))}
					</select>
				</label>
			</div>

			<div className={styles.fontContainer}>
				<label>
					font family:
					<select
						onChange={(e) =>
							handleStyleChange("fontFamily", e.target.value)
						}
						value={currentStyle.fontFamily || "Arial"}
					>
						{fonts.map((font) => (
							<option key={font} value={font}>
								{font}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className={styles.specialButtons}>
				<button
					onClick={() => toggleStyle("fontWeight", "bold")}
					className={
						isStyleActive("fontWeight", "bold") ? styles.blue : ""
					}
				>
					B
				</button>
				<button
					onClick={() => toggleStyle("fontStyle", "italic")}
					className={
						isStyleActive("fontStyle", "italic") ? styles.blue : ""
					}
				>
					I
				</button>
				<button
					onClick={() => toggleStyle("textDecoration", "underline")}
					className={
						isStyleActive("textDecoration", "underline")
							? styles.blue
							: ""
					}
				>
					U
				</button>
			</div>

			<div className={styles.specialButtons}>
				<button onClick={onDeleteWord} className={styles.red}>
					delete word
				</button>
				<button onClick={onClearText} className={styles.red}>
					delete all
				</button>
			</div>
		</div>
	);
}

export default SpecialButtons;
