import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";

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
	const touchStartRef = useRef({ x: 0, y: 0 });
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

	const handleMenuTouchStart = (event) => {
		const touch = event.touches[0];
		touchStartRef.current = {
			x: touch.clientX,
			y: touch.clientY,
		};
	};

	const handleMenuTouchEnd = (event) => {
		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStartRef.current.x;
		const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

		if (deltaX <= -60 && deltaY < 50) {
			setIsMenuOpen(false);
		}
	};

	return (
		<Navbar
			isBordered
			maxWidth="xl"
			className="border-b border-emerald-700/10 bg-[#dfeeda]/92 text-[#102016] shadow-lg shadow-emerald-950/5 backdrop-blur dark:border-emerald-100/10 dark:bg-[#16351f]/90 dark:text-[#eef6ef] dark:shadow-black/20"
		>
			<NavbarContent className="sm:hidden" justify="start">
				<button
					type="button"
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					aria-pressed={isMenuOpen}
					onClick={() => setIsMenuOpen((open) => !open)}
					className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-700/15 bg-white/65 text-[#102016] transition hover:bg-emerald-100 dark:border-emerald-100/15 dark:bg-[#21452a] dark:text-[#eef6ef] dark:hover:bg-[#295634]"
				>
					<svg
						aria-hidden="true"
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2.2"
						viewBox="0 0 24 24"
					>
						{isMenuOpen ? (
							<>
								<path d="M6 6l12 12" />
								<path d="M18 6 6 18" />
							</>
						) : (
							<>
								<path d="M4 7h16" />
								<path d="M4 12h16" />
								<path d="M4 17h16" />
							</>
						)}
					</svg>
				</button>
			</NavbarContent>

			<NavbarContent className="pr-3 sm:pr-0" justify="start">
				<NavbarBrand>
					<h1 className="text-lg font-black tracking-[0.18em] text-[#102016] sm:text-xl dark:text-[#eef6ef]">
						<a
							href="https://www.mymusicwrap.com/"
							className="transition hover:text-emerald-600 dark:hover:text-emerald-200"
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
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/15 bg-white/80 text-[#102016] transition hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-emerald-100/15 dark:bg-[#21452a] dark:text-[#eef6ef] dark:hover:bg-[#295634]"
					>
						<ThemeIcon isDarkMode={isDarkMode} />
					</button>
				</NavbarItem>
				<NavbarItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-400 dark:border-red-200/20 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-emerald-100/15 dark:bg-[#eef6ef] dark:text-[#102016] dark:hover:bg-white"
						>
							Log in
						</Link>
					)}
				</NavbarItem>
			</NavbarContent>

			<AnimatePresence>
				{isMenuOpen ? (
					<>
						<motion.button
							key="mobile-menu-overlay"
							type="button"
							aria-label="Close menu overlay"
							onClick={() => setIsMenuOpen(false)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18, ease: "easeOut" }}
							className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[#102016]/20 backdrop-blur-[2px] sm:hidden dark:bg-black/35"
						/>
						<motion.aside
							key="mobile-menu-panel"
							onTouchStart={handleMenuTouchStart}
							onTouchEnd={handleMenuTouchEnd}
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
							className="fixed left-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-3/4 max-w-sm touch-pan-y flex-col border-r border-emerald-700/10 bg-gradient-to-b from-[#f8fff8] via-[#eef8ef] to-[#dff4e3] px-5 pb-6 pt-6 text-[#102016] shadow-2xl shadow-emerald-950/20 sm:hidden dark:border-emerald-100/10 dark:from-[#16351f] dark:via-[#122b19] dark:to-[#0f1711] dark:text-[#eef6ef]"
						>
							<div>
								<button
									type="button"
									onClick={toggleTheme}
									aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
									title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
									className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/15 bg-white/80 text-[#102016] transition hover:bg-emerald-50 dark:border-emerald-100/15 dark:bg-[#21452a] dark:text-[#eef6ef] dark:hover:bg-[#295634]"
								>
									<ThemeIcon isDarkMode={isDarkMode} />
								</button>
							</div>

							<div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+2.5rem)]">
								{isAuthenticated ? (
									<div className="flex flex-col gap-4 rounded-[24px] border border-emerald-700/10 bg-white/70 p-4 backdrop-blur dark:border-emerald-100/10 dark:bg-white/10">
										<div className="flex min-w-0 items-center gap-3">
											{userImage ? (
												<img
													src={userImage}
													alt="user profile"
													className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-emerald-700/15 dark:ring-emerald-100/15"
												/>
											) : (
												<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700/15 text-sm font-black dark:bg-emerald-100/15">
													{userName.charAt(0)}
												</div>
											)}
											<p className="min-w-0 flex-1 truncate pr-2 text-sm font-bold">
												{userName}
											</p>
										</div>
										<button
											onClick={signOut}
											className="w-full rounded-full border border-red-300/30 bg-red-500/90 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400 dark:border-red-200/20 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
										>
											Sign out
										</button>
									</div>
								) : (
									<Link
										to="/login"
										className="block w-full rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-emerald-100/15 dark:bg-[#eef6ef] dark:text-[#102016] dark:hover:bg-white"
									>
										Log in
									</Link>
								)}
							</div>
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>
		</Navbar>
	);
};
