import axios from "axios";
import { useState, useEffect } from "react";

export const User = () => {
	const [user, setUser] = useState();

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
		} catch (err) {
			console.log("Error getting user info", err);
		}
	};

	useEffect(() => {
		if (!sessionStorage.getItem("accessToken")) return;

		getUserInfo(sessionStorage.getItem("accessToken"));
	}, []);

	return (
		<div className="mb-2">
			{sessionStorage.getItem("userName") || sessionStorage.getItem("code") ? (
				<div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-emerald-200/20 bg-[linear-gradient(145deg,rgba(17,33,23,0.92),rgba(26,52,36,0.88))] px-6 py-6 text-left shadow-[0_26px_60px_rgba(0,0,0,0.26)] sm:flex-row sm:items-center">
					<div className="max-w-4xl">
						<p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Welcome back</p>
						<h2 className="mb-2 font-['Gotham_Display'] text-3xl tracking-[-0.04em] text-[#f5fff7] sm:text-4xl">
							Hi {user?.name || sessionStorage.getItem("userName")}!
						</h2>
						<p className="m-0 max-w-3xl leading-7 text-emerald-50/75">
							Pick a timeframe and explore how your listening habits evolve.
						</p>
					</div>
					{user?.image ? (
						<img
							src={user.image}
							alt="user pic"
							width={68}
							height={68}
							className="rounded-full border-2 border-emerald-200/45 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
						/>
					) : null}
				</div>
			) : (
				<div className="flex flex-col items-start gap-4 rounded-[28px] border border-emerald-200/20 bg-[linear-gradient(145deg,rgba(17,33,23,0.92),rgba(26,52,36,0.88))] px-6 py-6 text-left shadow-[0_26px_60px_rgba(0,0,0,0.26)]">
					<div>
						<p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Get started</p>
						<h2 className="mb-2 font-['Gotham_Display'] text-3xl tracking-[-0.04em] text-[#f5fff7] sm:text-4xl">
							Authorize Spotify to unlock your listening history.
						</h2>
						<p className="max-w-3xl leading-7 text-emerald-50/75">
							Once you connect your account, this dashboard will show your top artists, tracks,
							and recommendations.
						</p>
					</div>
					<p className="text-sm text-emerald-50/70">
						<small className="leading-6">
							If you cannot log in to another account, please log out of your current Spotify
							account{" "}
							<a
								href="https://spotify.com/"
								target="_blank"
								rel="noreferrer"
								className="text-pink-300 transition hover:text-pink-200"
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
