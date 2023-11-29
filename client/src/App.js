import "./styles/App.css";
import { useState } from "react";
import { Feedback } from "./components/Feedback";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { SearchBar } from "./components/SearchBar";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/error";
import { Dashboard } from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// in the url, it looks for the query parameter 'code' and returns an object of the item after '?'
const code = new URLSearchParams(window.location.search).get("code");

function App() {
	const [spotifyCode, setSpotifyCode] = useState();
	const [codeExists, setCodeExists] = useState(false);

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

	console.log(code);
	console.log(spotifyCode);

	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/search" element={<SearchBar />} />
					<Route path="/userfeedback" element={<Feedback />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</Router>
			<Footer />
 			{!spotifyCode ? <></> : <Dashboard code={spotifyCode} />}
		</div>
	);
}

export default App;
