import "./App.css";
import { Songs } from "./pages/Songs";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { SearchBar } from "./components/SearchBar";
import { Login } from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dashboard } from "./components/Dashboard";

// const code = new URLSearchParams(window.location.search).get("code");

function App() {
	return (
		<div className="App">
			
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={ <Home /> } />
					<Route path="/login" element={ <Login /> } />
					<Route path="/search" element={ <SearchBar /> } />
					<Route path="/songs" element={ <Songs /> } />
				</Routes>
			</Router>
			{/* {!code ?? <Dashboard code={code} />} */}
		</div>
	);
}

export default App;
