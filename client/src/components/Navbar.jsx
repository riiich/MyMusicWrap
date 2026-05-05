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

export const NavigationBar = ({ isDarkMode, toggleTheme }) => {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));
	const navLinkClass =
		"rounded-full px-4 py-2 text-sm font-bold text-[#25462d] transition hover:bg-emerald-100 hover:text-emerald-800 dark:bg-white/18 dark:!text-white dark:ring-1 dark:ring-white/45 dark:hover:bg-white/30 dark:hover:!text-white";
	const mobileLinkClass =
		"block w-full rounded-2xl px-4 py-3 text-base font-bold text-[#25462d] transition hover:bg-emerald-100 dark:bg-white/18 dark:!text-white dark:ring-1 dark:ring-white/45 dark:hover:bg-white/30 dark:hover:!text-white";

	const signOut = () => {
		sessionStorage.clear();
		navigate("/");
		window.location.reload();
	};

	return (
		<Navbar
			isBordered
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			maxWidth="xl"
			className="border-b border-emerald-700/10 bg-[#f6fff6]/90 text-[#102016] shadow-lg shadow-emerald-950/5 backdrop-blur dark:border-white/35 dark:bg-[#4f8f5b]/95 dark:!text-white dark:shadow-black/20 dark:[&_*]:!text-white"
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="text-[#102016] dark:!text-white"
				/>
			</NavbarContent>

			<NavbarContent className="pr-3 sm:pr-0" justify="start">
				<NavbarBrand>
					<h1 className="text-lg font-black tracking-[0.18em] text-[#102016] sm:text-xl dark:!text-white">
						<a href="http://127.0.0.1:3000/" className="transition hover:text-emerald-600 dark:hover:!text-white">
							MyMusicWrap
						</a>
					</h1>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden gap-8 sm:flex" justify="center">
				<NavbarItem>
					<Link className={navLinkClass} to="/">
						Home
					</Link>
				</NavbarItem>

				<NavbarItem>
					<Link className={navLinkClass} to="/about">
						About
					</Link>
				</NavbarItem>

				{isAuthenticated && (
					<NavbarItem>
						<Link
							className={navLinkClass}
							to="/userfeedback"
						>
							Feedback
						</Link>
					</NavbarItem>
				)}
			</NavbarContent>

			<NavbarContent className="ml-auto pr-2 sm:pr-4" justify="end">
				<NavbarItem>
					<button
						type="button"
						onClick={toggleTheme}
						className="rounded-full border border-emerald-700/15 bg-white/80 px-4 py-2 text-sm font-bold text-[#102016] transition hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-white/80 dark:bg-white/22 dark:!text-white dark:shadow-[0_10px_24px_rgba(255,255,255,0.14)] dark:hover:bg-white/32 dark:hover:!text-white"
					>
						{isDarkMode ? "Light mode" : "Dark mode"}
					</button>
				</NavbarItem>
				<NavbarItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-400 dark:border-white/70 dark:bg-red-500 dark:!text-white dark:hover:bg-red-400 dark:hover:!text-white"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-white/80 dark:bg-white/22 dark:!text-white dark:hover:bg-white/32 dark:hover:!text-white"
						>
							Log in
						</Link>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu className="bg-[#f6fff6] pt-6 text-[#102016] dark:bg-[#4f8f5b] dark:!text-white dark:[&_*]:!text-white">
				<NavbarMenuItem>
					<Link className={mobileLinkClass} to="/">
						Home
					</Link>
				</NavbarMenuItem>

				<NavbarMenuItem>
					<Link className={mobileLinkClass} to="/about">
						About
					</Link>
				</NavbarMenuItem>

				{isAuthenticated && (
					<NavbarMenuItem>
						<Link className={mobileLinkClass} to="/userfeedback">
							Feedback
						</Link>
					</NavbarMenuItem>
				)}

				<NavbarMenuItem>
					<button
						type="button"
						onClick={toggleTheme}
						className="mt-2 rounded-full border border-emerald-700/15 bg-white/80 px-5 py-2 text-sm font-bold text-[#102016] transition hover:bg-emerald-50 dark:border-white/80 dark:bg-white/22 dark:!text-white dark:shadow-[0_10px_24px_rgba(255,255,255,0.14)] dark:hover:bg-white/32 dark:hover:!text-white"
					>
						{isDarkMode ? "Light mode" : "Dark mode"}
					</button>
				</NavbarMenuItem>

				<NavbarMenuItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="mt-2 rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-400 dark:border-white/70 dark:bg-red-500 dark:!text-white dark:hover:bg-red-400 dark:hover:!text-white"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="mt-2 inline-block rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 dark:border-white/80 dark:bg-white/22 dark:!text-white dark:hover:bg-white/32 dark:hover:!text-white"
						>
							Log in
						</Link>
					)}
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
};
