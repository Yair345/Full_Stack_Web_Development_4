import React from "react"; // Removed useState as it's no longer needed here
import AuthManager from "../AuthManager/AuthManager";
import FileManager from "../FileManager/FileManager";
import styles from "./UserInterface.module.css";

const UserInterface = ({
	textBlocks,
	setTextBlocks,
	onLogout,
	onLoginStatusChange,
	isLoggedIn,
}) => {
	const handleAuthChange = (status, user) => {
		if (onLoginStatusChange) {
			onLoginStatusChange(status, user);
		}
		// Handle logout notification separately if needed within AuthManager or here
		if (!status && onLogout) {
			onLogout();
		}
	};

	return (
		<div
			className={`${styles.userInterface} ${
				isLoggedIn ? styles.loggedIn : styles.loggedOut
			}`}
		>
			{/* Authentication Component */}
			<AuthManager onLoginStatusChange={handleAuthChange} />

			{/* File Management Component */}
			<FileManager
				textBlocks={textBlocks}
				setTextBlocks={setTextBlocks}
				isLoggedIn={isLoggedIn} // Use the prop directly
			/>
		</div>
	);
};

export default UserInterface;
