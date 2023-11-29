import { useState, useEffect } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedTracks } from "./RecommendedTracks";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const topArtistTimeRange = sessionStorage.getItem("artist_time_range");
	const [topTracks, setTopTracks] = useState([]);
	const topTrackTimeRange = sessionStorage.getItem("track_time_range");
	const [recommendedArtists, setRecommendedArtists] = useState([]);
	const [recommendedTracks, setRecommendedTracks] = useState([]);
	const [recommendedTracksMsg, setRecommendedTracksMsg] = useState("");
	const [loadingArtists, setLoadingArtists] = useState(true);
	const [loadingTracks, setLoadingTracks] = useState(true);
	const [loadingRecommended, setLoadingRecommended] = useState(false);
	const accessToken = sessionStorage.getItem("accessToken");

	// ************************ IF USER HASN"T SELECTED A TIME-FRAME IN THE ARTIST OR TRACKS, RETURN 

	const changeArtistTimeRange = (e) => {
		sessionStorage.setItem("artist_time_range", e.target.value);

		setTimeout(() => {
			window.location.reload();
		}, 500);
	};

	// refactor the below to only async/await (rmb that using async/await eliminates promise chaining)
	const retrieveTopArtistsFromUser = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/artists", {
				params: { accessToken, topArtistTimeRange },
			});

			setTopArtists(response.data.topArtists);
			setLoadingArtists(false);
		} catch (err) {
			console.error(err);
			setLoadingArtists(false);
		}
	};

	// change the time frame to get tracks within certain time frames (long(~1+ yrs), medium(~6 months), and short(~4 wks) term)
	const changeTrackTimeRange = (e) => {
		sessionStorage.setItem("track_time_range", e.target.value);

		setTimeout(() => {
			window.location.reload();
		}, 500);
	};

	const retrieveTopTracksFromUser = async (accessToken) => {
		try {
			// console.log(topTrackTimeRange);
			const response = await axios.get("http://localhost:3001/mostlistened/tracks", {
				params: { accessToken, topTrackTimeRange },
			});

			setTopTracks(response.data.topTracks);
			setLoadingTracks(false);
			console.log(response.data.msg);
		} catch (err) {
			console.error(err);
		}
	};

	const retrieveRecommendedTracks = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/recommendedtracks", {
				params: { accessToken },
			});

			setRecommendedTracks(response.data.recommended);
			setRecommendedTracksMsg(response.data.msg);
			setLoadingRecommended(true);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!accessToken) return;

		console.log("useEffect1 triggered");

		retrieveTopArtistsFromUser(accessToken);
		setLoadingArtists(true);
		// retrieveTopTracksFromUser(accessToken);
		// retrieveRecommendedTracks(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;

		console.log("useEffect2 triggered");
		retrieveTopTracksFromUser(accessToken);
		setLoadingTracks(true);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;

		setRecommendedTracks([]);

		if(recommendedTracks.length === 0){
			console.log("IT IS CURRENTLY EMPTY");
		}

		console.log("useEffect3 triggered");
		retrieveRecommendedTracks(accessToken);
		setLoadingRecommended(false);

		if(recommendedTracks.length > 0){
			console.log("IT IS NOT EMPTY ANYMORE");
		}
	}, [accessToken]);

	return (
		<div className="user-top-container">
			<div className="user-top-artists">
				<h1>Your Top 10 Artists</h1>
				<select
					classname="short-medium-long-artists"
					name="selected-artists-time-range"
					onChange={changeArtistTimeRange}
				>
					<option disabled="" selected="">
						Select a time frame...
					</option>
					<option value="long">~1+ years</option>
					<option value="medium">~6 months</option>
					<option value="short">~4 weeks</option>
				</select>
				<ListArtists userInfo={topArtists} loading={loadingArtists} />
			</div>

			<div className="user-top-tracks">
				<h1>Top Tracks in the {sessionStorage.getItem("track_time_range")} term</h1>
				<select
					classname="short-medium-long-tracks"
					name="selected-tracks-time-range"
					onChange={changeTrackTimeRange}
				>
					<option disabled="" selected="">
						Select a time frame...
					</option>
					<option value="long">~1+ years</option>
					<option value="medium">~6 months</option>
					<option value="short">~4 weeks</option>
				</select>
				<ListTracks userInfo={topTracks} loading={loadingTracks} />
			</div>

			<div className="user-recommended-tracks">
				<h1>Recommended Tracks</h1>
				<button
					onClick={() => {
						retrieveRecommendedTracks(accessToken);
					}}
					/*disabled={loadingRecommended}*/
				>
					Load More
				</button>
				<RecommendedTracks
					recommendedTracks={recommendedTracks}
					loading={loadingRecommended}
					accessToken={accessToken}
					message={recommendedTracksMsg}
				/>
			</div>
		</div>
	);
};
