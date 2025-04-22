// AuthManager.jsx
import { useState, useEffect } from "react";
import {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
} from "../../utils/userUtils";
import styles from "./AuthManager.module.css";

function AuthManager({ onLoginStatusChange }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
	const [message, setMessage] = useState("");
	const [currentUser, setCurrentUser] = useState(null);

	// Check if user is already logged in
	useEffect(() => {
		const user = getCurrentUser();
		if (user) {
			setCurrentUser(user);
			if (onLoginStatusChange) {
				onLoginStatusChange(true, user);
			}
		}
	}, [onLoginStatusChange]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!username || !password) {
			setMessage("Please enter both username and password.");
			return;
		}

		// Handle login or registration
		if (isLogin) {
			const result = loginUser(username, password);
			setMessage(result.message);

			if (result.success) {
				setCurrentUser(username);
				setUsername("");
				setPassword("");

				if (onLoginStatusChange) {
					onLoginStatusChange(true, username);
				}
			}
		} else {
			const result = registerUser(username, password);
			setMessage(result.message);

			if (result.success) {
				// Switch to login view after successful registration
				setIsLogin(true);
				setUsername("");
				setPassword("");
			}
		}
	};

	const handleLogout = () => {
		const result = logoutUser();
		setMessage(result.message);
		setCurrentUser(null);

		if (onLoginStatusChange) {
			onLoginStatusChange(false, null);
		}
	};

	// If user is logged in, show user info and logout button
	if (currentUser) {
		return (
			<div className={styles.authContainer}>
				<div className={styles.userInfo}>
					<span className={styles.welcomeText}>
						Welcome, <strong>{currentUser}</strong>!
					</span>
					<button
						onClick={handleLogout}
						className={styles.logoutButton}
					>
						Logout
					</button>
				</div>
				{message && <div className={styles.message}>{message}</div>}
			</div>
		);
	}

	// Otherwise show login/register form
	return (
		<div className={styles.authContainer}>
			<h2>{isLogin ? "Login" : "Register"}</h2>

			<form onSubmit={handleSubmit} className={styles.authForm}>
				<div className={styles.formGroup}>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter username"
						className={styles.input}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						className={styles.input}
					/>
				</div>

				<div className={styles.formActions}>
					<button type="submit" className={styles.button}>
						{isLogin ? "Login" : "Register"}
					</button>

					<button
						type="button"
						onClick={() => {
							setIsLogin(!isLogin);
							setMessage("");
						}}
						className={styles.linkButton}
					>
						{isLogin
							? "Need an account? Register"
							: "Already have an account? Login"}
					</button>
				</div>
			</form>

			{message && <div className={styles.message}>{message}</div>}
		</div>
	);
}

export default AuthManager;
