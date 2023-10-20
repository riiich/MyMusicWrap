import { Link } from "react-router-dom";
import {Dashboard} from "./Dashboard";

// in the url, it looks for the query parameter 'code' and returns an object of the item after '?'
const code = new URLSearchParams(window.location.search).get("code");

export const Navbar = () => {
	return (
		<div className="navbar">
			<h1>Spotify Compare</h1>
			<div className="links">
				<Link to="/">Home</Link>
				{!code ? (
					<Link to="/login">Login</Link>
				) : (
					<>
						<Dashboard code={code} />
						<Link to="/songs">Songs</Link>
						<Link to="/search">Search</Link>
					</>
				)}
			</div>
		</div>
	);
};
