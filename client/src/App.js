import "./styles/App.css";
import { useState } from 'react';
import { PlaySongs } from "./pages/PlaySongs";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { SearchBar } from "./components/SearchBar";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/error";
import { Dashboard } from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// in the url, it looks for the query parameter 'code' and returns an object of the item after '?'
const code = new URLSearchParams(window.location.search).get("code");

function App() {
	const [spotifyCode, setSpotifyCode] = useState("");

	// save the code in a state before the code becomes empty from the url
	if(code && spotifyCode.length === 0) {
		setSpotifyCode(code);
	}

	// console.log(code);
	// console.log(spotifyCode);

	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/search" element={<SearchBar />} />
					<Route path="/songs" element={<PlaySongs />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</Router>
			{/* PROBLEM IS THAT THE  */}
			{!spotifyCode ? <></> : <Dashboard code={spotifyCode} />}
		</div>
	);
}

export default App;
