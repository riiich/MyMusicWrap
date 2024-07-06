import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from "@nextui-org/navbar";

export const NavigationBar = () => {
	const navigate = new useNavigate();

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<Navbar isBordered>
			<NavbarBrand>
				<h1 className="bg-pink p-5">
					<a href="http://localhost:3000/">
						{/* <img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} /> */}
					</a>{" "}
					MyMusicWrap
				</h1>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link color="foreground" to="/">
						Home
					</Link>0
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" to="/about">
						About
					</Link>
				</NavbarItem>
				{!sessionStorage.getItem("accessToken") ? (
					<NavbarItem>
						<Link to="/login">Log in/Authorize</Link>
					</NavbarItem>
				) : (
					// <>
					// 	<Link to="/userfeedback">Feedback</Link>
					// 	<button onClick={signOut}>Sign out</button>
					// </>
					<>
						<NavbarItem>
							<Link color="foreground" to="/userfeedback">
								Feedback
							</Link>
						</NavbarItem>
						<NavbarItem>
							<button onClick={signOut}>Sign out</button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>
		</Navbar>

		// <div className="navbar">
		// 	<h1>
		// 		<a href="http://localhost:3000/">
		// 			{/* <img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} /> */}
		// 		</a>{" "}
		// 		MyMusicWrap
		// 	</h1>
		// 	<div className="links">
		// 		<Link to="/">Home</Link>
		// 		{/* <Link to="/about">About</Link> */}
		// 		{!sessionStorage.getItem("accessToken") ? (
		// 			<Link to="/login">Log in/Authorize</Link>
		// 		) : (
		// 			<>
		// 				<Link to="/userfeedback">Feedback</Link>
		// 				<button onClick={signOut}>Sign out</button>
		// 			</>
		// 		)}
		// 	</div>
		// </div>
	);
};
