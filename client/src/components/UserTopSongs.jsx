import { useEffect, useState } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedTracks } from "./RecommendedTracks";
import spotifyLogoWhite from "../images/Spotify_Logo_RGB_White.png";
import { SongPlayer } from "./SongPlayer";

const TIMEFRAME_LABELS = {
	long: "~1+ years",
	medium: "~6 months",
	short: "~4 weeks",
};

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [recommendedTracks, setRecommendedTracks] = useState([]);
	const [recommendedTracksMsg, setRecommendedTracksMsg] = useState("");
	const [loadingArtists, setLoadingArtists] = useState(false);
	const [loadingTracks, setLoadingTracks] = useState(false);
	const [loadingRecommended, setLoadingRecommended] = useState(false);
	const [selectedTrackURI, setSelectedTrackURI] = useState("");
	const [topArtistTimeRange, setTopArtistTimeRange] = useState(
		() => sessionStorage.getItem("artist_time_range") || "",
	);
	const [topTrackTimeRange, setTopTrackTimeRange] = useState(
		() => sessionStorage.getItem("track_time_range") || "",
	);
	const accessToken = sessionStorage.getItem("accessToken");

	const changeArtistTimeRange = (e) => {
		if (!sessionStorage.getItem("userName")) return;

		const nextRange = e.target.value;
		sessionStorage.setItem("artist_time_range", nextRange);
		setTopArtistTimeRange(nextRange);
	};

	const retrieveTopArtistsFromUser = async (token, timeRange) => {
		try {
			if (!timeRange) {
				setTopArtists([]);
				setLoadingArtists(false);
				return;
			}

			setLoadingArtists(true);
			const response = await axios.get("http://localhost:3001/mostlistened/artists", {
				params: { accessToken: token, topArtistTimeRange: timeRange },
			});

			setTopArtists(response.data.topArtists);
		} catch (err) {
			console.error(err);
			setTopArtists([]);
		} finally {
			setLoadingArtists(false);
		}
	};

	const changeTrackTimeRange = (e) => {
		if (!sessionStorage.getItem("userName")) return;

		const nextRange = e.target.value;
		sessionStorage.setItem("track_time_range", nextRange);
		setTopTrackTimeRange(nextRange);
	};

	const retrieveTopTracksFromUser = async (token, timeRange) => {
		try {
			if (!timeRange) {
				setTopTracks([]);
				setLoadingTracks(false);
				return;
			}

			setLoadingTracks(true);
			const response = await axios.get("http://localhost:3001/mostlistened/tracks", {
				params: { accessToken: token, topTrackTimeRange: timeRange },
			});

			setTopTracks(response.data.topTracks);
		} catch (err) {
			console.error(err);
			setTopTracks([]);
		} finally {
			setLoadingTracks(false);
		}
	};

	const retrieveRecommendedTracks = async (token, timeRange) => {
		try {
			if (!timeRange) {
				setRecommendedTracks([]);
				setRecommendedTracksMsg("");
				setLoadingRecommended(false);
				return;
			}

			setLoadingRecommended(true);
			const response = await axios.get("http://localhost:3001/mostlistened/recommendedtracks", {
				params: { accessToken: token },
			});

			setRecommendedTracks(response.data.recommended);
			setRecommendedTracksMsg(response.data.msg);
		} catch (err) {
			console.error(err);
			setRecommendedTracks([]);
			setRecommendedTracksMsg("We couldn't load recommendations right now.");
		} finally {
			setLoadingRecommended(false);
		}
	};

	// callback function to get the uri from RecommendedTracks component 
	const getURI = (uri) => {
		setSelectedTrackURI(uri);
	}

	useEffect(() => {
		if (!accessToken) return;
		retrieveTopArtistsFromUser(accessToken, topArtistTimeRange);
	}, [accessToken, topArtistTimeRange]);

	useEffect(() => {
		if (!accessToken) return;
		retrieveTopTracksFromUser(accessToken, topTrackTimeRange);
	}, [accessToken, topTrackTimeRange]);

	useEffect(() => {
		if (!accessToken) return;
		retrieveRecommendedTracks(accessToken, topTrackTimeRange);
	}, [accessToken, topTrackTimeRange]);

	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-3 lg:grid-cols-2">
			<section className="flex min-h-full flex-col items-stretch rounded-[30px] border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(21,35,26,0.94),rgba(12,21,16,0.96)),linear-gradient(135deg,rgba(74,222,128,0.08),transparent_45%)] p-6 shadow-[0_28px_50px_rgba(0,0,0,0.24)]">
				<div className="text-left">
					<p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald-300">
						Profile Snapshot
					</p>
					<h1 className="font-['Gotham_Display'] text-[clamp(1.35rem,1.6vw,1.85rem)] tracking-[-0.04em] text-[#f5fff7]">
						Your Top 10 Artists
					</h1>
					<p className="mt-3 leading-7 text-emerald-50/70">
						{topArtistTimeRange
							? `Based on your ${TIMEFRAME_LABELS[topArtistTimeRange]} listening window`
							: "Choose a timeframe to load your artist rankings."}
					</p>
				</div>
				<img
					src={spotifyLogoWhite}
					alt="spotify logo"
					className="mb-4 mt-5 w-36 self-start opacity-90"
				/>
				<select
					className="w-full max-w-[16rem] self-start rounded-[18px] border border-emerald-200/20 bg-white/95 px-4 py-3 text-[0.95rem] font-medium text-[#0f1f14] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-400/50"
					name="selected-artists-time-range"
					onChange={changeArtistTimeRange}
					value={topArtistTimeRange}
				>
					<option disabled value="">
						Select a time frame...
					</option>
					<option value="long">~1+ years</option>
					<option value="medium">~6 months</option>
					<option value="short">~4 weeks</option>
				</select>
				<ListArtists userInfo={topArtists} loading={loadingArtists} />
			</section>

			<section className="flex min-h-full flex-col items-stretch rounded-[30px] border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(21,35,26,0.94),rgba(12,21,16,0.96)),linear-gradient(135deg,rgba(74,222,128,0.08),transparent_45%)] p-6 shadow-[0_28px_50px_rgba(0,0,0,0.24)]">
				<div className="text-left">
					<p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald-300">
						On Repeat
					</p>
					<h1 className="font-['Gotham_Display'] text-[clamp(1.35rem,1.6vw,1.85rem)] tracking-[-0.04em] text-[#f5fff7]">
						Your Top Tracks
					</h1>
					<p className="mt-3 leading-7 text-emerald-50/70">
						{topTrackTimeRange
							? `Pulled from your ${TIMEFRAME_LABELS[topTrackTimeRange]} track history`
							: "Choose a timeframe to load your most-played tracks."}
					</p>
				</div>
				<img
					src={spotifyLogoWhite}
					alt="spotify logo"
					className="mb-4 mt-5 w-36 self-start opacity-90"
				/>
				<select
					className="w-full max-w-[16rem] self-start rounded-[18px] border border-emerald-200/20 bg-white/95 px-4 py-3 text-[0.95rem] font-medium text-[#0f1f14] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-400/50"
					name="selected-tracks-time-range"
					onChange={changeTrackTimeRange}
					value={topTrackTimeRange}
				>
					<option disabled value="">
						Select a time frame...
					</option>
					<option value="long">~1+ years</option>
					<option value="medium">~6 months</option>
					<option value="short">~4 weeks</option>
				</select>
				<ListTracks userInfo={topTracks} loading={loadingTracks} />
			</section>

			<section className="flex min-h-full flex-col items-stretch rounded-[30px] border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(21,35,26,0.94),rgba(12,21,16,0.96)),linear-gradient(135deg,rgba(74,222,128,0.08),transparent_45%)] p-6 shadow-[0_28px_50px_rgba(0,0,0,0.24)] lg:col-span-2 xl:col-span-1">
				<div className="text-left">
					<p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald-300">
						Discovery Queue
					</p>
					<h1 className="font-['Gotham_Display'] text-[clamp(1.35rem,1.6vw,1.85rem)] tracking-[-0.04em] text-[#f5fff7]">
						Recommended Tracks
					</h1>
					<p className="mt-3 leading-7 text-emerald-50/70">
						Recommendations adapt to your currently selected track timeframe.
					</p>
				</div>
				<img
					src={spotifyLogoWhite}
					alt="spotify logo"
					className="mb-4 mt-5 w-36 self-start opacity-90"
				/>
				<button
					className="mt-4 inline-flex w-fit self-start rounded-full bg-[linear-gradient(135deg,#22c55e,#bef264)] px-5 py-3 font-bold text-[#08130d] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
					onClick={() => {
						retrieveRecommendedTracks(accessToken, topTrackTimeRange);
					}}
					disabled={!topTrackTimeRange || loadingRecommended}
				>
					{loadingRecommended ? "Refreshing..." : "Load More"}
				</button>
				<RecommendedTracks
					recommendedTracks={recommendedTracks}
					retrieveURI={getURI}
					loading={loadingRecommended}
					accessToken={accessToken}
					message={recommendedTracksMsg}
				/>
			</section>
			{selectedTrackURI ? (
				<div className="fixed bottom-10 left-1/2 z-[60] w-[min(860px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[24px] border border-emerald-200/20 bg-[#0a130d]/92 p-3 shadow-[0_24px_50px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
					<SongPlayer accessToken={accessToken} trackURI={selectedTrackURI} />
				</div>
			) : null}
		</div>
	);
};
