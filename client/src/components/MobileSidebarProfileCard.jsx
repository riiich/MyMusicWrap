export const MobileSidebarProfileCard = ({ userName, userImage, onSignOut }) => {
	return (
		<div className="flex flex-col gap-4 rounded-[24px] border border-emerald-700/10 bg-white/80 p-4 text-[#102016] shadow-2xl shadow-emerald-950/15 backdrop-blur dark:border-emerald-100/10 dark:bg-[#203b27]/95 dark:text-[#eef6ef] dark:shadow-black/25">
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
				type="button"
				onClick={onSignOut}
				className="w-full rounded-full border border-red-300/30 bg-red-500/90 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400 dark:border-red-200/20 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
			>
				Sign out
			</button>
		</div>
	);
};
