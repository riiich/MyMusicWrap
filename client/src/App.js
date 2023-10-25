import "./styles/App.css";
import { Songs } from "./pages/Songs";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { SearchBar } from "./components/SearchBar";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/error";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";

// in the url, it looks for the query parameter 'code' and returns an object of the item after '?'
const code = new URLSearchParams(window.location.search).get("code");

function App() {
	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/search" element={<SearchBar />} />
					<Route path="/songs" element={<Songs />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</Router>
			{!code ? <></> : <Dashboard code={code} />}
		</div>
	);
}

export default App;
