// App.jsx
import { useState } from "react";
import DisplayManager from "./components/DisplayManager/DisplayManager";
import UserInterface from "./components/UserInterface/UserInterface";
import TextControls from "./components/TextControls/TextControls"; // Assuming this component exists
import {
	getDisplayBlocks,
	updateDisplayBlocks,
	saveToHistory,
	getDisplayHistory,
	updateDisplayHistory,
	resetDisplays,
} from "./utils/displayUtils";
import { getCurrentUser } from "./utils/userUtils";
import styles from "./App.module.css";

function App() {
	// Get initial login status directly
	const username = getCurrentUser();

	// User authentication state with initial values
	const [isLoggedIn, setIsLoggedIn] = useState(!!username);
	const [currentUser, setCurrentUser] = useState(username || null);

	// Array of displays, each containing text blocks
	const [displays, setDisplays] = useState([[]]);
	const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
	const [displayHistories, setDisplayHistories] = useState([[]]);

	// State for Selection
	const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1); // -1 means no block selected
	const [allBlocksSelected, setAllBlocksSelected] = useState(false);

	// Helper wrapper functions that use our utility functions
	const getCurrentDisplayBlocks = () => {
		return getDisplayBlocks(displays, activeDisplayIndex);
	};

	// Use the robust version of updateCurrentDisplayBlocks
	const updateCurrentDisplayBlocks = (updater) => {
		setDisplays((currentDisplays) => {
			// Use functional update for setDisplays
			// Get the current blocks for the active display from the latest state
			const activeBlocks = getDisplayBlocks(
				currentDisplays,
				activeDisplayIndex
			);

			// If updater is a function (like the one from SpecialButtons), call it with the current active blocks
			// Otherwise, assume updater is the new array of blocks directly
			const newBlocks =
				typeof updater === "function" ? updater(activeBlocks) : updater;

			// Use the utility function to create the final updated displays array
			return updateDisplayBlocks(
				currentDisplays,
				activeDisplayIndex,
				newBlocks
			);
		});
	};

	const saveToCurrentHistory = () => {
		setDisplayHistories(
			saveToHistory(
				displayHistories,
				activeDisplayIndex,
				getCurrentDisplayBlocks()
			)
		);
	};

	const getCurrentHistory = () => {
		return getDisplayHistory(displayHistories, activeDisplayIndex);
	};

	const setCurrentHistory = (newHistory) => {
		setDisplayHistories(
			updateDisplayHistory(
				displayHistories,
				activeDisplayIndex,
				newHistory
			)
		);
	};

	// Function to handle logout reset
	const handleLogout = () => {
		// Reset displays when logging out
		const {
			displays: newDisplays,
			activeIndex,
			histories,
		} = resetDisplays();
		setDisplays(newDisplays);
		setActiveDisplayIndex(activeIndex);
		setDisplayHistories(histories);
		setSelectedBlockIndex(-1);
		setAllBlocksSelected(false);
	};

	// Handle login status change
	const handleLoginStatusChange = (status, user) => {
		setIsLoggedIn(status);
		setCurrentUser(user);

		if (!status) {
			handleLogout();
		}
	};

	const handleSelectBlock = (index) => {
		// Set the index of the clicked block as selected
		setSelectedBlockIndex(index);
		// Selecting a single block cancels the 'Select All' state
		setAllBlocksSelected(false);
	};

	return (
		<div className={styles.container}>
			<h1>Visual Text Editor</h1>

			{/* User Interface Component (combines Auth and File Management) */}
			<UserInterface
				textBlocks={getCurrentDisplayBlocks()}
				setTextBlocks={updateCurrentDisplayBlocks}
				onLogout={handleLogout}
				onLoginStatusChange={handleLoginStatusChange}
				isLoggedIn={isLoggedIn}
			/>

			{/* Display Area */}
			<DisplayManager
				displays={displays}
				setDisplays={setDisplays}
				activeDisplayIndex={activeDisplayIndex}
				setActiveDisplayIndex={setActiveDisplayIndex}
				onSelectBlock={handleSelectBlock} // Pass the implemented function
				selectedBlockIndex={selectedBlockIndex} // Pass state for highlighting
			/>

			{/* Text Controls Component */}
			<TextControls
				textBlocks={getCurrentDisplayBlocks()}
				setTextBlocks={updateCurrentDisplayBlocks}
				history={getCurrentHistory()}
				setHistory={setCurrentHistory}
				saveToHistory={saveToCurrentHistory}
				selectedBlockIndex={selectedBlockIndex}
				setSelectedBlockIndex={setSelectedBlockIndex}
				allBlocksSelected={allBlocksSelected}
				setAllBlocksSelected={setAllBlocksSelected}
			/>
		</div>
	);
}

export default App;
