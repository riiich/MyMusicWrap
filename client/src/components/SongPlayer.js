import SpotifyPlayer from "react-spotify-web-playback";

export const SongPlayer = ({ accessToken, trackURI }) => {
	if (!accessToken) return null;

	return (
		// <div className="song-player">
		<SpotifyPlayer
			token={accessToken}
			showSaveIcon
			autoPlay
			magnifySliderOnHover
			uris={trackURI ? [trackURI] : []}
			styles={{
				bgColor: "#333",
				color: "#fff",
				loaderColor: "#fff",
				sliderColor: "#1cb954",
				savedColor: "#fff",
				trackArtistColor: "#ccc",
				trackNameColor: "#fff",
			}}
		/>
		// </div>
	);
};
