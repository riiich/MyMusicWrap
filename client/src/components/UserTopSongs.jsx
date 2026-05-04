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
	const panelClass =
		"flex min-h-full flex-col items-stretch rounded-[30px] border border-emerald-700/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(226,244,229,0.94)),linear-gradient(135deg,rgba(34,197,94,0.08),transparent_45%)] p-6 shadow-[0_28px_50px_rgba(16,64,30,0.12)] dark:border-lime-200/15 dark:bg-[linear-gradient(180deg,rgba(23,45,29,0.94),rgba(10,24,15,0.96)),linear-gradient(135deg,rgba(190,242,100,0.12),transparent_45%)] dark:shadow-[0_28px_50px_rgba(0,0,0,0.24)]";
	const eyebrowClass = "mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-lime-300";
	const headingClass = "font-['Gotham_Display'] text-[clamp(1.35rem,1.6vw,1.85rem)] tracking-[-0.04em] text-[#102016] dark:text-[#f5fff7]";
	const descriptionClass = "mt-3 leading-7 text-[#486052] dark:text-lime-50/70";
	const selectClass =
		"w-full max-w-[16rem] self-start rounded-[18px] border border-emerald-700/10 bg-white/95 px-4 py-3 text-[0.95rem] font-medium text-[#0f1f14] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-400/50 dark:border-lime-200/20 dark:bg-lime-50/95";

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
			<section className={panelClass}>
				<div className="text-left">
					<p className={eyebrowClass}>
						Profile Snapshot
					</p>
					<h1 className={headingClass}>
						Your Top 10 Artists
					</h1>
					<p className={descriptionClass}>
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
					className={selectClass}
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

			<section className={panelClass}>
				<div className="text-left">
					<p className={eyebrowClass}>
						On Repeat
					</p>
					<h1 className={headingClass}>
						Your Top Tracks
					</h1>
					<p className={descriptionClass}>
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
					className={selectClass}
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

			<section className={`${panelClass} lg:col-span-2 xl:col-span-1`}>
				<div className="text-left">
					<p className={eyebrowClass}>
						Discovery Queue
					</p>
					<h1 className={headingClass}>
						Recommended Tracks
					</h1>
					<p className={descriptionClass}>
						Recommendations adapt to your currently selected track timeframe.
					</p>
				</div>
				<img
					src={spotifyLogoWhite}
					alt="spotify logo"
					className="mb-4 mt-5 w-36 self-start opacity-90"
				/>
				<button
					className="mt-4 inline-flex w-fit self-center rounded-full bg-[linear-gradient(135deg,#22c55e,#bef264)] px-5 py-3 font-bold text-[#08130d] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
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
				<div className="fixed bottom-10 left-1/2 z-[60] w-[min(860px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[24px] border border-emerald-700/10 bg-white/95 p-3 shadow-[0_24px_50px_rgba(16,64,30,0.18)] backdrop-blur-[10px] dark:border-lime-200/20 dark:bg-[#0a130d]/92 dark:shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
					<SongPlayer accessToken={accessToken} trackURI={selectedTrackURI} />
				</div>
			) : null}
		</div>
	);
};
