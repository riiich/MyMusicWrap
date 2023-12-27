import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HamburgerMenu } from "./HamburgerMenu";

export const Navbar = () => {
	const navigate = new useNavigate();
	// const [dropdownMenu, setDropdownMenu] = useState("nav-menu");
	// const [toggleNav, setToggleNav] = useState("");

	// const navToggle = () => {
	// 	if (dropdownMenu === "nav-menu") {
	// 		setDropdownMenu("nav-menu nav-active");
	// 	} else setDropdownMenu("nav-menu");

	// 	// Icon Toggler
	// 	// if (icon === "nav__toggler") {
	// 	//   setIcon("nav__toggler toggle");
	// 	// } else setIcon("nav__toggler");
	// };

	const [active, setActive] = useState("nav__menu");
	const [icon, setIcon] = useState("nav__toggler");

	const navToggle = () => {
		active === "nav__menu" 
		? setActive("nav__menu nav__active")
		: setActive("nav__menu");

		// Icon Toggler
		if (icon === "nav__toggler") {
			setIcon("nav__toggler toggle");
		} else setIcon("nav__toggler");
	};

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<div className="nav">
			<h1 className="nav__brand">
				<a href="http://localhost:3000/">
					<img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} />
				</a>{" "}
				<div className="nav-app-name">MyMusicWrap</div>
			</h1>
			<div className="links">
				{!sessionStorage.getItem("accessToken") ? (
					<Link to="/login">Log in/Authorize</Link>
				) : (
					<>
						{/* <div className="logged-in-links"> */}
						<ul className={active}>
							<li className="nav__item">
								<Link to="/" className="nav__link">
									Home
								</Link>
							</li>
							<li className="nav__item">
								<Link to="/about" className="nav__link">
									About
								</Link>
							</li>
							<li className="nav__item">
								<Link to="/userfeedback" className="nav__link">
									Feedback
								</Link>
							</li>
							<li className="nav__item">
								<button onClick={signOut} className="nav__link">
									Sign out
								</button>
							</li>
						</ul>

						{/* </div> */}
						{/* <div onClick={navToggle}>
							<HamburgerMenu navToggle={navToggle} icon={icon} />
						</div> */}
						<div onClick={navToggle} className={icon}>
							<div className="line1"></div>
							<div className="line2"></div>
							<div className="line3"></div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

/* 

<div className="navbar">
			<h1>
				<a href="http://localhost:3000/">
					<img src={require("../images/icon.png")} alt="app_logo" width={50} height={50} />
				</a>{" "}
				<div className="nav-app-name">MyMusicWrap</div>
			</h1>
			<div className="links">
				{!sessionStorage.getItem("accessToken") ? (
					<Link to="/login">Log in/Authorize</Link>
				) : (
					<>
						 <div className="logged-in-links"> 
						<ul className={dropdownMenu}>
							<li className="nav-item">
								<Link to="/">Home</Link>
							</li>
							<li className="nav-item">
								<Link to="/about">About</Link>
							</li>
							<li className="nav-item">
								<Link to="/userfeedback">Feedback</Link>
							</li>
						</ul>
						<button onClick={signOut}>Sign out</button>
						</div> 
						<div onClick={navToggle} className="toggle-btn open">
							<HamburgerMenu />
						</div>
						<div className="dropdown-menu">
							<Link to="/">Home</Link>
							<Link to="/about">About</Link>
							<Link to="/userfeedback">Feedback</Link>
							<button onClick={signOut}>Sign out</button>
						</div> 
					</>
				)}
			</div>
		</div>

*/
