import { motion } from "framer-motion";
import { MobileSidebarProfileCard } from "./MobileSidebarProfileCard";

export const MobileSidebar = ({
	isAuthenticated,
	isDarkMode,
	onSignOut,
	onThemeToggle,
	onTouchEnd,
	onTouchStart,
	themeIcon,
	userImage,
	userName,
}) => {
	const preventSidebarScroll = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<motion.aside
			key="mobile-menu-panel"
			onTouchMove={preventSidebarScroll}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onWheel={preventSidebarScroll}
			initial={{ x: "-100%" }}
			animate={{ x: 0 }}
			exit={{ x: "-100%" }}
			transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
			className="fixed left-0 top-16 z-50 flex h-[calc(100svh-4rem)] max-h-[calc(100svh-4rem)] w-3/4 max-w-sm touch-none flex-col justify-between overflow-hidden overscroll-none border-r border-emerald-700/10 bg-gradient-to-b from-[#f8fff8] via-[#eef8ef] to-[#dff4e3] px-5 pb-5 pt-5 text-[#102016] shadow-2xl shadow-emerald-950/20 sm:hidden dark:border-emerald-100/10 dark:from-[#16351f] dark:via-[#122b19] dark:to-[#0f1711] dark:text-[#eef6ef]"
		>
			<div className="shrink-0">
				<button
					type="button"
					onClick={onThemeToggle}
					aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
					title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
					className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/15 bg-white/80 text-[#102016] transition hover:bg-emerald-50 dark:border-emerald-100/15 dark:bg-[#21452a] dark:text-[#eef6ef] dark:hover:bg-[#295634]"
				>
					{themeIcon}
				</button>
			</div>

			{isAuthenticated ? (
				<div className="shrink-0 pb-5">
					<MobileSidebarProfileCard
						userName={userName}
						userImage={userImage}
						onSignOut={onSignOut}
					/>
				</div>
			) : null}
		</motion.aside>
	);
};
