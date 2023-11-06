import { useState } from "react";
import axios from "axios";

export const RecommendedTracks = ({ userInfo, loading, accessToken }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlistsExist, setPlaylistExists] = useState(false);

	const getUserPlaylists = async () => {
		try {
			const response = await axios.get("http://localhost:3001/myplaylists", {
				params: { accessToken },
			});

			console.log(response.data);
			setPlaylists(response.data.playlists);
			setTimeout(() => {
				console.log(playlists);
			}, 2000);
			setPlaylistExists(true);

		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="recommended-container">
			{loading ? (
				<h3>Loading...</h3>
			) : (
				userInfo?.map((item, i) => (
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
								<button className="recommended-add-song-button" onClick={getUserPlaylists}>
									Add song
								</button>
								{ playlistsExist ? 
									<select>
										{ playlists?.map((playlist) => 
											<option>{playlist?.playlistName}</option>
										) }
									</select>
									:
									<></>	
							}
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};
