// App.jsx
import { useState } from "react";
import DisplayManager from "./components/DisplayManager/DisplayManager";
import UserInterface from "./components/UserInterface/UserInterface";
import TextControls from "./components/TextControls/TextControls";
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

	// Helper wrapper functions that use our utility functions
	const getCurrentDisplayBlocks = () => {
		return getDisplayBlocks(displays, activeDisplayIndex);
	};

	const updateCurrentDisplayBlocks = (newBlocks) => {
		setDisplays(
			updateDisplayBlocks(displays, activeDisplayIndex, newBlocks)
		);
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
		// This function is passed to DisplayManager
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
				onSelectBlock={handleSelectBlock}
			/>

			{/* Text Controls Component (combines Advanced Editing Tools and Input Controls) */}
			<TextControls
				textBlocks={getCurrentDisplayBlocks()}
				setTextBlocks={updateCurrentDisplayBlocks}
				history={getCurrentHistory()}
				setHistory={setCurrentHistory}
				saveToHistory={saveToCurrentHistory}
			/>
		</div>
	);
}

export default App;
