import React from 'react'; // Removed useState as it's no longer needed here
import AuthManager from '../AuthManager/AuthManager';
import FileManager from '../FileManager/FileManager';
// Removed getCurrentUser import as isLoggedIn is now passed down
import styles from './UserInterface.module.css';

const UserInterface = ({
  textBlocks,
  setTextBlocks,
  onLogout, // Still needed for AuthManager/logout functionality
  onLoginStatusChange, // This is the function passed from App.jsx
  isLoggedIn // This is the state passed from App.jsx
}) => {

  // No need for internal state (isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser)
  // We will use the props passed down from App.jsx directly

  // The handleLoginStatusChange function passed to AuthManager
  // should be the one received from App.jsx
  const handleAuthChange = (status, user) => {
    // Call the function passed from App.jsx to update the state there
    if (onLoginStatusChange) {
      onLoginStatusChange(status, user);
    }
    // Handle logout notification separately if needed within AuthManager or here
    if (!status && onLogout) {
      // It might be cleaner for AuthManager to call onLogout directly when logout occurs
      // But we keep the original logic for now
      onLogout();
    }
  };

  return (
    <div className={styles.userInterface}>
      {/* Authentication Component */}
      {/* Pass the handleAuthChange function which correctly calls the App.jsx handler */}
      <AuthManager onLoginStatusChange={handleAuthChange} />

      {/* File Management Component */}
      {/* Use the isLoggedIn prop directly from App.jsx */}
      <FileManager
        key={isLoggedIn ? "logged-in" : "logged-out"} // Key can still be useful
        textBlocks={textBlocks}
        setTextBlocks={setTextBlocks}
        isLoggedIn={isLoggedIn} // Use the prop directly
      />
    </div>
  );
};

export default UserInterface;