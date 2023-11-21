import { useState, useEffect } from "react";
import axios from "axios";
import { SongPlayer } from "./SongPlayer";
// import { Modal } from "./Modal";

export const RecommendedTracks = ({ recommendedTracks, loading, accessToken, message }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlistsExist, setPlaylistExists] = useState(false);
	// const [playlistsExist, setPlaylistExists] = useState(Array(recommendedTracks.length).fill(false));
	const [selectedTrackURI, setSelectedTrackURI] = useState("");
	const [selectedPlaylistId, setSelectedPlaylistId] = useState({ playlistId: null, trackURI: null });
	const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
	// const [isModal, setIsModal] = useState(false);

	// const setModal = (e) => {
	// 	setIsModal((prev) => !prev);
	// };

	const plExists = (e, index) => {
		try {
			console.log(playlistsExist);
			// setPlaylistExists((prev) => !prev);
			// if (e.target.className === "recommended-add-song-button") {
			setPlaylistExists((prev) => !prev);
			// 	setSelectedTrackIndex(index);
			// 	console.log(selectedTrackIndex);
			// 	setPlaylistExists((prevShowPlaylists) => {
			// 		console.log(selectedTrackIndex);
			// 		const updatedShowPlaylists = [...prevShowPlaylists];
			// 		updatedShowPlaylists[index] = !updatedShowPlaylists[index];
			// 		console.log(updatedShowPlaylists);
			// 		return updatedShowPlaylists;
			// 	});
			// } else if (e.target.className === "playlists") {
			// 	// check to see if the value had any value in it (have to check, otherwise there will be an error relating to json)
				if (e.target.value) {
					const parsedInfo = JSON.parse(e.target.value); // in order to use the json, have to parse it back to object b/c it was stringified json
					setSelectedPlaylistId({
						playlistId: parsedInfo.playlistId,
						trackURI: parsedInfo.trackURI,
					});
				}
			// }
		} catch (err) {
			console.log(err);
		}
	};

	const getURI = (uri) => {
		setSelectedTrackURI(uri);
	};

	const trackHasPlaylists = (track, playlists) => {
		return playlists.some((playlist) => track.uri === playlist.trackURI);
	};

	useEffect(() => {
		const getUserPlaylists = async () => {
			try {
				const response = await axios.get("http://localhost:3001/myplaylists", {
					params: { accessToken },
				});

				setPlaylists(response.data.playlists);
				setPlaylistExists(true);

				// setPlaylistExists((prevPlaylistExists) => {
				// 	const updatedPlaylistExists = [...prevPlaylistExists];
				// 	recommendedTracks.forEach((track, index) => {
				// 		updatedPlaylistExists[index] = trackHasPlaylists(track, response.data.playlists);
				// 	});
				// 	return updatedPlaylistExists;
				// });
			} catch (err) {
				console.log(err);
			}
		};

		console.log(playlistsExist);
		if (accessToken && playlistsExist) {
			getUserPlaylists();
		}

		// if (accessToken) {
		// 	getUserPlaylists();
		// }
	}, [accessToken, playlistsExist, recommendedTracks]);

	useEffect(() => {
		const addTrackToPlaylist = async () => {
			try {
				// console.log(selectedTrackIndex);

				// if (selectedTrackIndex !== null) {
				await axios.post("http://localhost:3001/myplaylists/addToPlaylist", {
					accessToken,
					selectedPlaylistId,
				});

				// await new Promise((resolve) => {
				// 	setPlaylistExists((prevShowPlaylists) => {
				// 		const updatedPlaylistExists = [...prevShowPlaylists];
				// 		updatedPlaylistExists[selectedTrackIndex] =
				// 		console.log(updatedPlaylistExists);
				// 		console.log(playlistsExist);
				// 		return updatedPlaylistExists;
				// 	}, resolve);
				// });
				// }
			} catch (err) {
				console.log(err);
			}
		};

		if (accessToken && !playlistsExist) {
			addTrackToPlaylist();
		}

		// if (accessToken && !playlistsExist[selectedTrackIndex]) {
		// 	addTrackToPlaylist();
		// }
	}, [accessToken, playlistsExist, selectedPlaylistId]);

	return (
		<div className="recommended-container">
			{!loading ? (
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
								<button
									className="recommended-preview-song-button"
									onClick={(e) => getURI(item?.uri)}
								>
									Play Song
								</button>
								<button
									className="recommended-add-song-button"
									onClick={(e) => plExists(e, i)}
								>
									Add song
								</button>
								{playlistsExist ? (
									<>
										<select
											className="playlists"
											name="selectedPlaylist"
											onChange={(e) => plExists(e, i)}
										>
											<option disabled="" selected="">
												Select a playlist...
											</option>
											{playlists?.map((playlist) => (
												<option
													value={JSON.stringify({
														playlistId: playlist?.playlistId,
														trackURI: item?.uri,
													})}
													key={playlist.playlistId}
												>
													{playlist?.playlistName}
												</option>
											))}
										</select>
									</>
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
				))
			)}
			{selectedTrackURI ? (
				<SongPlayer accessToken={accessToken} trackURI={selectedTrackURI} />
			) : (
				<p>{message}</p>
			)}
		</div>
	);
};
