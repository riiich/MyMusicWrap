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
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

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
			className="border-b border-emerald-300/20 bg-[#16241a]/90 text-white shadow-lg shadow-black/20 backdrop-blur"
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
			</NavbarContent>

			<NavbarContent className="pr-3 sm:pr-0" justify="start">
				<NavbarBrand>
					<h1 className="text-lg font-semibold tracking-[0.18em] text-white sm:text-xl">
						<a href="http://127.0.0.1:3000/" className="transition hover:text-emerald-300">
							MyMusicWrap
						</a>
					</h1>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden gap-8 sm:flex" justify="center">
				<NavbarItem>
					<Link className="text-sm font-medium text-zinc-100 transition hover:text-emerald-300" to="/">
						Home
					</Link>
				</NavbarItem>

				<NavbarItem>
					<Link className="text-sm font-medium text-zinc-100 transition hover:text-emerald-300" to="/about">
						About
					</Link>
				</NavbarItem>

				{isAuthenticated && (
					<NavbarItem>
						<Link
							className="text-sm font-medium text-zinc-100 transition hover:text-emerald-300"
							to="/userfeedback"
						>
							Feedback
						</Link>
					</NavbarItem>
				)}
			</NavbarContent>

			<NavbarContent className="ml-auto pr-2 sm:pr-4" justify="end">
				<NavbarItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
						>
							Log in
						</Link>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu className="bg-[#1c2b20] pt-6 text-white">
				<NavbarMenuItem>
					<Link className="w-full text-base font-medium" to="/">
						Home
					</Link>
				</NavbarMenuItem>

				<NavbarMenuItem>
					<Link className="w-full text-base font-medium" to="/about">
						About
					</Link>
				</NavbarMenuItem>

				{isAuthenticated && (
					<NavbarMenuItem>
						<Link className="w-full text-base font-medium" to="/userfeedback">
							Feedback
						</Link>
					</NavbarMenuItem>
				)}

				<NavbarMenuItem>
					{isAuthenticated ? (
						<button
							onClick={signOut}
							className="mt-2 rounded-full border border-red-300/30 bg-red-500/90 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
						>
							Sign out
						</button>
					) : (
						<Link
							to="/login"
							className="mt-2 inline-block rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
						>
							Log in
						</Link>
					)}
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
};
