import { useEffect, useState } from "react";
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

const ThemeIcon = ({ isDarkMode }) => {
	if (isDarkMode) {
		return (
			<svg
				aria-hidden="true"
				className="h-5 w-5"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			className="h-5 w-5"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			<path d="M20.99 13.18A8 8 0 1 1 10.82 3.01a6 6 0 1 0 10.17 10.17Z" />
		</svg>
	);
};

export const NavigationBar = ({ isDarkMode, toggleTheme }) => {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mobileAccount, setMobileAccount] = useState({
		name: sessionStorage.getItem("userName") || "Spotify listener",
		image: sessionStorage.getItem("userImage") || "",
	});
	const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));
	const userName = mobileAccount.name;
	const userImage = mobileAccount.image;

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	useEffect(() => {
		if (!isMenuOpen) return;

		setMobileAccount({
			name: sessionStorage.getItem("userName") || "Spotify listener",
			image: sessionStorage.getItem("userImage") || "",
		});
	}, [isMenuOpen]);

	return (
		<Navbar
			isBordered
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			maxWidth="xl"
			className="border-b border-emerald-700/10 bg-[#f6fff6]/90 text-[#102016] shadow-lg shadow-emerald-950/5 backdrop-blur dark:border-black/20 dark:bg-[#4f8f5b]/95 dark:!text-black dark:shadow-black/20 dark:[&_*]:!text-black"
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="text-[#102016] dark:!text-black"
				/>
			</NavbarContent>

			<NavbarContent className="pr-3 sm:pr-0" justify="start">
				<NavbarBrand>
					<h1 className="text-lg font-black tracking-[0.18em] text-[#102016] sm:text-xl dark:!text-black">
						<a
							href="http://127.0.0.1:3000/"
							className="transition hover:text-emerald-600 dark:hover:!text-black"
						>
							MyMusicWrap
						</a>
					</h1>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="ml-auto hidden pr-2 sm:flex sm:pr-4" justify="end">
				<NavbarItem>
					<button
						type="button"
						onClick={toggleTheme}
						aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
						title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/15 bg-white/80 text-[#102016] transition hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-black/20 dark:bg-white/80 dark:!text-black dark:hover:bg-white dark:hover:!text-black"
					>
						<ThemeIcon isDarkMode={isDarkMode} />
					</button>
				</NavbarItem>
				<NavbarItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-400 dark:border-black/20 dark:bg-red-500 dark:!text-black dark:hover:bg-red-400 dark:hover:!text-black"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-black/20 dark:bg-white/80 dark:!text-black dark:hover:bg-white dark:hover:!text-black"
						>
							Log in
						</Link>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu className="!left-0 !right-auto !top-16 flex !h-[calc(100vh-4rem)] !w-3/4 max-w-sm flex-col bg-[#f6fff6] px-5 pb-6 pt-6 text-[#102016] shadow-2xl shadow-emerald-950/20 dark:bg-[#4f8f5b] dark:!text-black dark:[&_*]:!text-black">
				<NavbarMenuItem>
					<button
						type="button"
						onClick={toggleTheme}
						aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
						title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
						className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/15 bg-white/80 text-[#102016] transition hover:bg-emerald-50 dark:border-black/20 dark:bg-white/80 dark:!text-black dark:hover:bg-white dark:hover:!text-black"
					>
						<ThemeIcon isDarkMode={isDarkMode} />
					</button>
				</NavbarMenuItem>

				<NavbarMenuItem className="mt-auto">
					{isAuthenticated ? (
						<div className="flex flex-col gap-4 rounded-[24px] bg-white/70 p-4 dark:bg-white/55">
							<div className="flex min-w-0 items-center gap-3">
								{userImage ? (
									<img
										src={userImage}
										alt="user profile"
										className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-emerald-700/15"
									/>
								) : (
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700/15 text-sm font-black">
										{userName.charAt(0)}
									</div>
								)}
								<p className="min-w-0 flex-1 truncate pr-2 text-sm font-bold">
									{userName}
								</p>
							</div>
							<button
								onClick={signOut}
								className="w-full rounded-full border border-red-300/30 bg-red-500/90 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400 dark:border-black/20 dark:bg-red-500 dark:!text-black dark:hover:bg-red-400 dark:hover:!text-black"
							>
								Sign out
							</button>
						</div>
					) : (
						<Link
							to="/login"
							className="block w-full rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-black/20 dark:bg-white/80 dark:!text-black dark:hover:bg-white dark:hover:!text-black"
						>
							Log in
						</Link>
					)}
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
};
