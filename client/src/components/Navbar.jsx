import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = new useNavigate();

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<div className="navbar">
			<h1>
				<a href="http://localhost:3000/">
					<img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} />
				</a>{" "}
				SpotifyMe
			</h1>
			<div className="links">
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
				{!sessionStorage.getItem("accessToken") ? (
					<Link to="/login">Log in/Authorize</Link>
				) : (
					<>
						<Link to="/userfeedback">Feedback</Link>
						<button onClick={signOut}>Sign out</button>
					</>
				)}
			</div>
		</div>
	);
};
