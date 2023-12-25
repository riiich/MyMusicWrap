import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const NavigationBar = () => {
	const navigate = new useNavigate();
	// I BARELY MADE THIS COMMENT AT 651AM
	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<div className="navbar">
			<h1>
				<i class="fa-solid fa-bars"></i>
				<a href="https://my-music-wrap.vercel.app/">
					<img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} />
				</a>{" "}
				MyMusicWrap
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
