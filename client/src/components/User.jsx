import axios from "axios";
import { useState, useEffect } from "react";
import { logoutIfAuthExpired } from "../utils/authSession";

export const User = () => {
	const [user, setUser] = useState();
	const storedUserName = sessionStorage.getItem("userName");
	const storedUserImage = sessionStorage.getItem("userImage");
	const displayName = user?.name || storedUserName;
	const displayImage = user?.image || storedUserImage;

	const getUserInfo = async (accessToken) => {
		try {
			// const res = await axios.get("https://mymusicwrap.onrender.com/user", {
			// const res = await axios.get("https://my-music-wrap-server.vercel.app/user", {
			const res = await axios.get("http://localhost:3001/user", {
				params: { accessToken },
			});
			setUser(res.data);

			// store user info in session storage
			sessionStorage.setItem("userName", res.data?.name);
			sessionStorage.setItem("userID", res.data?.id);
			sessionStorage.setItem("userSpotifyURL", res.data?.userSpotify);
			if (res.data?.image) sessionStorage.setItem("userImage", res.data.image);
		} catch (err) {
			console.log("Error getting user info", err);
			logoutIfAuthExpired(err);
		}
	};

	useEffect(() => {
		if (!sessionStorage.getItem("accessToken")) return;

		getUserInfo(sessionStorage.getItem("accessToken"));
	}, []);

	return (
		<div className="mb-2">
			{storedUserName || sessionStorage.getItem("code") ? (
				<div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-emerald-900/10 bg-[linear-gradient(145deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-6 py-6 text-left shadow-[0_24px_48px_rgba(35,86,49,0.12)] dark:border-lime-200/20 dark:bg-[linear-gradient(145deg,rgba(17,33,23,0.92),rgba(31,70,42,0.9))] dark:shadow-[0_26px_60px_rgba(0,0,0,0.26)] sm:flex-row sm:items-center">
					<div className="max-w-4xl">
						<p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700 dark:text-lime-300">
							Welcome back
						</p>
						<h2 className="mb-2 font-['Gotham_Display'] text-3xl tracking-[-0.04em] text-[#102016] dark:!text-[#f5fff7] sm:text-4xl">
							Hi {displayName}!
						</h2>
						<p className="m-0 max-w-3xl leading-7 text-[#486052] dark:!text-[#ffffff]">
							Pick a timeframe and explore how your listening habits evolve.
						</p>
					</div>
					{displayImage ? (
						<img
							src={displayImage}
							alt="user pic"
							width={68}
							height={68}
							className="rounded-full border-2 border-emerald-200/45 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
						/>
					) : null}
				</div>
			) : (
				<div
					className="flex flex-col items-start gap-4 rounded-[28px] border border-emerald-900/10 bg-[linear-gradient(145deg,rgba(232,246,226,0.98),
								rgba(214,235,204,0.98))] px-6 py-6 text-left shadow-[0_24px_48px_rgba(35,86,49,0.12)] dark:border-lime-200/20 
								dark:bg-[linear-gradient(145deg,rgba(17,33,23,0.92),rgba(31,70,42,0.9))] dark:shadow-[0_26px_60px_rgba(0,0,0,0.26)]"
				>
					<div>
						<p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700 dark:text-lime-300">
							Get started
						</p>
						<h2 className="mb-2 font-['Gotham_Display'] text-3xl tracking-[-0.04em] text-[#102016] dark:text-[#f5fff7] sm:text-4xl">
							Authorize Spotify to unlock your listening history.
						</h2>
						<p className="max-w-3xl leading-7 text-[#486052] dark:text-[#f7fff5]">
							Once you connect your account, this dashboard will show your top artists, tracks,
							and recommendations.
						</p>
						<a
							href="/login"
							className="mt-5 inline-flex rounded-full border border-emerald-900/10 bg-[#b8f5a6] px-6 py-3 text-sm font-bold 
									 text-[#06120a] shadow-[0_14px_26px_rgba(16,32,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#d8ffd0] 
									   dark:border-lime-200/30"
						>
							Log in with Spotify
						</a>
					</div>
					<p className="text-sm text-[#486052] dark:text-[#f7fff5]">
						<small className="leading-6">
							If you cannot log in to another account, please log out of your current Spotify
							account{" "}
							<a
								href="https://spotify.com/"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 underline underline-offset-4 transition hover:text-blue-500 dark:text-white dark:hover:text-sky-300"
							>
								here.
							</a>
						</small>
					</p>
				</div>
			)}
		</div>
	);
};
