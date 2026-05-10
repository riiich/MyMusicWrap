import { useEffect } from "react";
import { clientCredentials } from "../credentials";

export const Dashboard = ({ code }) => {
	const { accessToken, showExpiryModal, refreshAccessToken, logoutUser } = clientCredentials(code);

	useEffect(() => {
		if (!accessToken) return;

		sessionStorage.setItem("accessToken", accessToken);
	}, [accessToken]);

	if (!showExpiryModal) return null;

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07130b]/70 px-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[2rem] border border-[#d3ef83]/70 bg-[#f1ffd3] p-6 text-center text-[#102016] shadow-[0_24px_80px_rgba(7,19,11,0.35)] dark:border-[#b9f55e]/35 dark:bg-[#102016] dark:text-[#f5fff7]">
				<p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-[#4f7d24] dark:text-[#d9ff7a]">
					Session expiring
				</p>
				<h2 className="mb-3 font-['Gotham_Display'] text-3xl tracking-[-0.04em]">
					Your Spotify session is about to expire.
				</h2>
				<p className="mb-6 leading-7 text-[#486052] dark:text-[#e8ffe2]">
					You will be logged out in 10 seconds unless you choose to stay logged in.
				</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onClick={logoutUser}
						className="flex-1 rounded-full border border-[#9bb765] px-5 py-3 font-bold text-[#102016] transition hover:bg-[#e1f5a8] dark:border-[#d9ff7a]/40 dark:text-[#f5fff7] dark:hover:bg-[#1f3b25]"
					>
						Okay
					</button>
					<button
						type="button"
						onClick={refreshAccessToken}
						className="flex-1 rounded-full bg-[#102016] px-5 py-3 font-bold text-[#f5fff7] transition hover:bg-[#24472c] dark:bg-[#d9ff7a] dark:text-[#102016] dark:hover:bg-[#c6f45f]"
					>
						Stay logged in
					</button>
				</div>
			</div>
		</div>
	);
};
