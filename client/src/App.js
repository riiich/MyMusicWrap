import { useEffect, useState } from "react";
import { Feedback } from "./components/Feedback";
import { NavigationBar } from "./components/Navbar";
import { About } from "./pages/About";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SharedSnapshot } from "./pages/SharedSnapshot";
import { ErrorPage } from "./pages/error";
import { Dashboard } from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

// in the url, it looks for the query parameter 'code' and returns an object of the item after '?'
const code = new URLSearchParams(window.location.search).get("code");

function App() {
	const [spotifyCode, setSpotifyCode] = useState();
	const [codeExists, setCodeExists] = useState(false);
	const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
	const isDarkMode = theme === "dark";

	const toggleTheme = () => {
		const nextTheme = isDarkMode ? "light" : "dark";
		localStorage.setItem("theme", nextTheme);
		setTheme(nextTheme);
	};

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDarkMode);
	}, [isDarkMode]);

	// save the code in a state before the code becomes empty from the url
	if (!codeExists) {
		setSpotifyCode(code);
		setCodeExists(true);
	}

	/*
	POSSIBLE PROBLEM WITH THE REFRESH TOKEN PROBLEM
		The code gets saved from the url at when the user initially authorizes, but when the page is changed or
			an action is made, the code becomes null because there is no code in the url anymore since
			we made it disappear in credentials.js in the userLogin function
	*/

	return (
		<NextUIProvider>
			<div className={`${theme} flex min-h-screen flex-col`}>
				<Router>
					<NavigationBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
					<main className="flex-1">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/share/:snapshotId" element={<SharedSnapshot />} />
							<Route path="/about" element={<About />} />
							<Route path="/userfeedback" element={<Feedback />} />
							<Route path="*" element={<ErrorPage />} />
						</Routes>
					</main>
					<Footer />
				</Router>
				{!spotifyCode ? <></> : <Dashboard code={spotifyCode} />}
			</div>
		</NextUIProvider>
	);
}

export default App;
