import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const RecommendedTracks = ({ recommendedTracks, loading, accessToken }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlistsExist, setPlaylistExists] = useState(false);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState({ playlistID: null, trackURI: null });
	// const [selectedPlaylistId, setSelectedPlaylistId] = useState({});

	const plExists = (e) => {
		try {
			setPlaylistExists((prev) => !prev);
			console.log(playlistsExist);

			// check to see if the value had any value in it (have to check, otherwise there will be an error relating to json)
			if (e.target.value) {
				const parsedInfo = JSON.parse(e.target.value);		// in order to use the json, have to parse it back to object b/c it was stringified json
				// console.log(e.target.value);
				// console.log(parsedInfo.playlistId);
				// setSelectedPlaylistId(e.target.value);
				setSelectedPlaylistId({
					playlistID: parsedInfo.playlistId,
					trackURI: parsedInfo.trackURI,
				});
				// console.log(selectedPlaylistId);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const getUserPlaylists = async () => {
			try {
				const response = await axios.get("http://localhost:3001/myplaylists", {
					params: { accessToken },
				});

				setPlaylists(response.data.playlists);
				setPlaylistExists(true);
			} catch (err) {
				console.log(err);
			}
		};

		if (accessToken && playlistsExist) {
			getUserPlaylists();
		}
	}, [accessToken, playlistsExist]);

	useEffect(() => {
		const addTrackToPlaylist = async () => {
			const response = await axios.post("http://localhost:3001/myplaylists/addToPlaylist", {
				selectedPlaylistId,
			});
		};
	}, [selectedPlaylistId]);

	return (
		<div className="recommended-container">
			{loading ? (
				<h3>Loading...</h3>
			) : (
				recommendedTracks?.map((item, i) => (
					<div className="single-item" key={item.id}>
						<div className="recommended-buttons">
							<a href={item.spotify_url} target="_blank" rel="noopener noreferrer">
								<img src={item.image} alt="track_img" width={55} height={55} />
								<div>
									<p className="recommended-track-title">
										<strong>{item.track_title}</strong>
									</p>
									<div className="recommended-track-artists">
										{item?.artists.map((artist) => (
											<p key={artist.id}>&nbsp;{artist.name}</p>
										))}
									</div>
								</div>
							</a>
							<div className="preview-add-buttons">
								<button className="recommended-preview-song-button">Preview Song</button>
								<button className="recommended-add-song-button" onClick={plExists}>
									Add song
								</button>
								{playlistsExist ? (
									<select className="playlists" name="selectedPlaylist" onChange={plExists}>
										{playlists?.map((playlist) => (
											// <div>
											<option
												value={JSON.stringify({
													playlistId: playlist?.playlistId,
													trackURI: item?.uri,
												})}
												key={playlist.playlistId}
											>
												{playlist?.playlistName}
											</option>
											// </div>
										))}
									</select>
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};
