const CLIENT_ID = "addd071529764e90bb548a5b11edc35f"; // can be in the frontend since it's public
const redirect_uri = "http://127.0.0.1:3000/";
// const redirect_uri = "https://my-music-wrap.vercel.app/";
const AUTH_URL = `https://accounts.spotify.com/authorize?${new URLSearchParams({
	client_id: CLIENT_ID,
	response_type: "code",
	redirect_uri,
	scope:
		"streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-follow-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-playback-position user-top-read user-read-recently-played",
}).toString()}`;

export const Login = () => {
	return (
		<div>
			<h1>Please authorize with your Spotify account.</h1>

			<a className="authorize" href={AUTH_URL}>
				<button>Authorize</button>
			</a>
		</div>
	);
};
