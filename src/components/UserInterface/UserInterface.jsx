import React, { useState } from 'react';
import AuthManager from '../AuthManager/AuthManager';
import FileManager from '../FileManager/FileManager';
import { getCurrentUser } from '../../utils/userUtils';
import styles from './UserInterface.module.css';

const UserInterface = ({ textBlocks, setTextBlocks, onLogout }) => {
  // Get initial login status without useEffect
  const username = getCurrentUser();
  
  // Move user authentication state to this component with initial values
  const [isLoggedIn, setIsLoggedIn] = useState(!!username);
  const [currentUser, setCurrentUser] = useState(username || null);

  // Handle login status change
  const handleLoginStatusChange = (status, user) => {
    setIsLoggedIn(status);
    setCurrentUser(user);

    // Notify parent component about logout
    if (!status && onLogout) {
      onLogout();
    }
  };

  return (
    <div className={styles.userInterface}>
      {/* Authentication Component */}
      <AuthManager onLoginStatusChange={handleLoginStatusChange} />

      {/* File Management Component */}
      <FileManager 
        key={isLoggedIn ? "logged-in" : "logged-out"}
        textBlocks={textBlocks}
        setTextBlocks={setTextBlocks}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default UserInterface;