const CLIENT_ID = "addd071529764e90bb548a5b11edc35f"; // can be in the frontend since it's public
const redirect_uri = "https://www.mymusicwrap.com/";
const AUTH_URL = `https://accounts.spotify.com/authorize?${new URLSearchParams({
	client_id: CLIENT_ID,
	response_type: "code",
	redirect_uri,
	show_dialog: "true",	// prompt user to manually log in in every authorization
	scope:
		"streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-follow-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-playback-position user-top-read user-read-recently-played",
}).toString()}`;

export const Login = () => {
	return (
		<div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
			<div className="w-full rounded-[2rem] border border-emerald-700/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(223,244,227,0.9))] px-8 py-12 shadow-[0_26px_60px_rgba(16,64,30,0.12)] dark:border-lime-200/10 dark:bg-[linear-gradient(145deg,rgba(17,33,23,0.92),rgba(31,70,42,0.9))] dark:shadow-[0_26px_60px_rgba(0,0,0,0.26)]">
				<p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700 dark:text-lime-300">Connect Spotify</p>
				<h1 className="mb-4 font-['Gotham_Display'] text-3xl text-[#102016] dark:text-[#f5fff7] sm:text-4xl">
					Authorize your Spotify account
				</h1>
				<p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-[#486052] dark:text-lime-50/70 sm:text-base">
					Sign in to load your top artists, top tracks, and tailored recommendations across multiple listening windows.
				</p>

				<a
					href={AUTH_URL}
					className="inline-flex rounded-full bg-[linear-gradient(135deg,#8b5cf6,#22c55e)] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(34,197,94,0.2)] transition hover:-translate-y-0.5 hover:brightness-105"
				>
					Authorize
				</a>
			</div>
		</div>
	);
};
