import { useState } from "react";
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
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className="bg-gray-dark">
			<NavbarContent className="lg:hidden pr-3" justify="center">
				<NavbarBrand>
					<h1 className="font-bold">
						<a href="http://localhost:3000/">
							{/* <img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} /> */}
							MyMusicWrap
						</a>{" "}
					</h1>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="sm:hidden" justify="end">
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link color="foreground" to="/">
						Home
					</Link>
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

			<NavbarMenu className="opacity-90 bg-green" justify="end">
				<NavbarMenuItem>
					<Link className="w-full" to="/" size="lg">
						Home
					</Link>
				</NavbarMenuItem>

				<NavbarMenuItem>
					<Link className="w-full" to="/about" size="lg">
						About
					</Link>
				</NavbarMenuItem>

				{!sessionStorage.getItem("accessToken") ? (
					<NavbarMenuItem>
						<Link className="w-full" to="/login" size="lg">
							Login/Authorize
						</Link>
					</NavbarMenuItem>
				) : (
					<NavbarMenuItem>
						<button onClick={signOut}>Sign out</button>
					</NavbarMenuItem>
				)}
			</NavbarMenu>
		</Navbar>
	);
};
