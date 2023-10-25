import { Link } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const Navbar = () => {
	return (
		<div className="navbar">
			<h1><a href="http://localhost:3000/"><img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} /></a> Spotify Compare</h1>
			<div className="links">
				<Link to="/">Home</Link>
				{!sessionStorage.getItem("accessToken") ? (
					<Link to="/login">Login</Link>
				) : (
					<>
						<Link to="/songs">Songs</Link>
						{/* <Link to="/search">Search</Link> */}
					</>
				)}
			</div>
		</div>
	);
};
