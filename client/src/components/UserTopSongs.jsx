import { useEffect, useState } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedTracks } from "./RecommendedTracks";
import spotifyLogoGreen from "../images/Spotify_Logo_RGB_Green.png";
import spotifyLogoWhite from "../images/Spotify_Logo_RGB_White.png";
import { SongPlayer } from "./SongPlayer";
import { ShareSnapshotCard } from "./ShareSnapshotCard";
import { TIMEFRAME_LABELS } from "../utils/shareSnapshot";
import { logoutIfAuthExpired } from "../utils/authSession";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [recommendedTracks, setRecommendedTracks] = useState([]);
	const [recommendedTracksMsg, setRecommendedTracksMsg] = useState("");
	const [loadingArtists, setLoadingArtists] = useState(false);
	const [loadingTracks, setLoadingTracks] = useState(false);
	const [loadingRecommended, setLoadingRecommended] = useState(false);
	const [selectedTrackURI, setSelectedTrackURI] = useState("");
	const [isPlayerVisible, setIsPlayerVisible] = useState(false);
	const [shouldPlayerPlay, setShouldPlayerPlay] = useState(false);
	const [topArtistTimeRange, setTopArtistTimeRange] = useState(
		() => localStorage.getItem("artist_time_range") || "",
	);
	const [topTrackTimeRange, setTopTrackTimeRange] = useState(
		() => localStorage.getItem("track_time_range") || "",
	);
	const accessToken = sessionStorage.getItem("accessToken");
	const isAuthenticated = Boolean(accessToken || sessionStorage.getItem("userName"));
	const panelClass =
		"flex min-h-full flex-col items-stretch rounded-[30px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] p-6 text-[#17301d] shadow-[0_24px_48px_rgba(35,86,49,0.12)] dark:border-lime-200/15 dark:bg-[linear-gradient(180deg,rgba(23,45,29,0.94),rgba(10,24,15,0.96)),linear-gradient(135deg,rgba(190,242,100,0.12),transparent_45%)] dark:text-[#f4fbf1] dark:shadow-[0_28px_50px_rgba(0,0,0,0.24)]";
	const eyebrowClass = "mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#55734b] dark:text-[#ddefd7]";
	const headingClass = "font-['Gotham_Display'] text-[clamp(1.35rem,1.6vw,1.85rem)] tracking-[-0.04em] text-[#17301d] dark:text-[#f7fff5]";
	const descriptionClass = "mt-3 leading-7 text-[#355240] dark:text-[#d6e8d2]";
	const selectClass =
		"w-full max-w-[16rem] self-start rounded-[18px] border border-emerald-900/10 bg-white px-4 py-3 text-[0.95rem] font-medium text-[#17301d] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-900/15 [&_option]:bg-white [&_option]:text-[#17301d] dark:border-white/25 dark:bg-[#17271a] dark:text-[#f4fbf1] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:focus:outline-white/45 dark:[&_option]:bg-[#102016] dark:[&_option]:text-[#f7fff5]";

	const changeArtistTimeRange = (e) => {
		if (!sessionStorage.getItem("userName")) return;

		const nextRange = e.target.value;
		localStorage.setItem("artist_time_range", nextRange);
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
			if (logoutIfAuthExpired(err)) return;
			setTopArtists([]);
		} finally {
			setLoadingArtists(false);
		}
	};

	const changeTrackTimeRange = (e) => {
		if (!sessionStorage.getItem("userName")) return;

		const nextRange = e.target.value;
		localStorage.setItem("track_time_range", nextRange);
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
			if (logoutIfAuthExpired(err)) return;
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
			if (logoutIfAuthExpired(err)) return;
			setRecommendedTracks([]);
			setRecommendedTracksMsg("We couldn't load recommendations right now.");
		} finally {
			setLoadingRecommended(false);
		}
	};

	// callback function to get the uri from RecommendedTracks component 
	const getURI = (uri) => {
		setShouldPlayerPlay(false);
		setSelectedTrackURI(uri);
		setIsPlayerVisible(true);
		window.setTimeout(() => {
			setShouldPlayerPlay(true);
		}, 0);
	};

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

	if (!isAuthenticated) return null;

	return (
		<div>
			<ShareSnapshotCard
				artistTimeRange={topArtistTimeRange}
				trackTimeRange={topTrackTimeRange}
				topArtists={topArtists}
				topTracks={topTracks}
			/>
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)]">
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
						src={spotifyLogoGreen}
						alt="spotify logo"
						className="mb-4 mt-5 w-36 self-start opacity-90 dark:hidden"
					/>
					<img
						src={spotifyLogoWhite}
						alt="spotify logo"
						className="mb-4 mt-5 hidden w-36 self-start opacity-90 dark:block"
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
						src={spotifyLogoGreen}
						alt="spotify logo"
						className="mb-4 mt-5 w-36 self-start opacity-90 dark:hidden"
					/>
					<img
						src={spotifyLogoWhite}
						alt="spotify logo"
						className="mb-4 mt-5 hidden w-36 self-start opacity-90 dark:block"
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
						src={spotifyLogoGreen}
						alt="spotify logo"
						className="mb-4 mt-5 w-36 self-start opacity-90 dark:hidden"
					/>
					<img
						src={spotifyLogoWhite}
						alt="spotify logo"
						className="mb-4 mt-5 hidden w-36 self-start opacity-90 dark:block"
					/>
					<button
						className="mt-4 inline-flex w-fit self-center rounded-full border border-emerald-900/10 bg-white/55 px-5 py-3 font-bold text-[#17301d] shadow-[0_12px_28px_rgba(35,86,49,0.12)] transition hover:-translate-y-0.5 hover:bg-white/75 disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/25 dark:bg-white/15 dark:text-[#f7fff5] dark:shadow-[0_12px_28px_rgba(0,0,0,0.16)] dark:hover:bg-white/25"
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
					<div
						className={`${isPlayerVisible ? "fixed bottom-10 left-1/2 z-[60] w-[min(860px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[24px] border border-emerald-700/10 bg-white/95 p-3 pt-8 shadow-[0_24px_50px_rgba(16,64,30,0.18)] backdrop-blur-[10px] dark:border-lime-200/20 dark:bg-[#0a130d]/92 dark:shadow-[0_24px_50px_rgba(0,0,0,0.35)]" : "fixed -bottom-[999px] left-0 h-px w-px overflow-hidden opacity-0"}`}
						aria-hidden={!isPlayerVisible}
					>
						<button
							type="button"
							onClick={() => {
								setShouldPlayerPlay(false);
								setIsPlayerVisible(false);
							}}
							aria-label="Close Spotify player"
							title="Close Spotify player"
							className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-900/10 bg-white/70 text-lg font-bold leading-none text-[#17301d] transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-[#f7fff5] dark:hover:bg-white/20"
						>
							<span aria-hidden="true">&times;</span>
						</button>
						<SongPlayer
							accessToken={accessToken}
							trackURI={selectedTrackURI}
							shouldPlay={shouldPlayerPlay}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
};
