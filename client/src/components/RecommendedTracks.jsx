import { useState, useEffect } from "react";
import axios from "axios";
import { GlidingText } from "./GlidingText";

export const RecommendedTracks = ({ recommendedTracks, retrieveURI, loading, accessToken, message }) => {
	const [playlists, setPlaylists] = useState([]);
	const [activePlaylistTrackUri, setActivePlaylistTrackUri] = useState("");
	const [confirmedTrackUri, setConfirmedTrackUri] = useState("");
	const [toastMessages, setToastMessages] = useState([]);

	const getUserPlaylists = async () => {
		try {
			const response = await axios.get("https://mymusicwrap.onrender.com/myplaylists", {
				params: { accessToken },
			});

			setPlaylists(response.data.playlists);
		} catch (err) {
			console.log(err);
		}
	};

	const showPlaylistDropdown = async (trackURI) => {
		setActivePlaylistTrackUri((currentURI) => (currentURI === trackURI ? "" : trackURI));

		if (accessToken && playlists.length === 0) {
			await getUserPlaylists();
		}
	};

	const addTrackToPlaylist = async (playlistId, trackURI, playlistName) => {
		try {
			if (!playlistId || !trackURI) return;

			await axios.post("https://mymusicwrap.onrender.com/myplaylists/addToPlaylist", {
				accessToken,
				selectedPlaylistId: { playlistId, trackURI },
			});
			setActivePlaylistTrackUri("");
			setConfirmedTrackUri(trackURI);

			const toastId = `${trackURI}-${playlistId}-${Date.now()}`;
			setToastMessages((currentMessages) => [
				...currentMessages,
				{ id: toastId, message: `Track added to ${playlistName}` },
			]);

			window.setTimeout(() => {
				setConfirmedTrackUri("");
			}, 1000);
			window.setTimeout(() => {
				setToastMessages((currentMessages) => currentMessages.filter((toast) => toast.id !== toastId));
			}, 2500);
		} catch (err) {
			console.log(err);
		}
	};

	const getURI = (uri) => {
		retrieveURI(uri);
	};

	useEffect(() => {
		setActivePlaylistTrackUri("");
	}, [recommendedTracks]);

	return (
		<>
			<div className="mt-5 flex flex-col gap-4">
				{loading ? (
					<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#102016] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-emerald-900/10 dark:shadow-none">
						Loading recommendations...
					</p>
				) : recommendedTracks?.length === 0 ? (
					<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#102016] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-emerald-900/10 dark:shadow-none">
						{message || "Choose a track timeframe to load recommendations."}
					</p>
				) : (
					recommendedTracks?.map((item, i) => (
						<div
							key={item.id}
							className={`${activePlaylistTrackUri === item?.uri ? "relative z-30" : "relative z-0"} animate-[riseIn_.45s_ease_both]`}
							style={{ animationDelay: `${i * 70}ms` }}
						>
							<div className="grid h-[6.5rem] grid-cols-[minmax(0,1fr)_auto] items-stretch gap-4">
								<a
									href={item.spotify_url}
									target="_blank"
									rel="noopener noreferrer"
									className="relative flex min-h-0 items-center gap-3 overflow-hidden rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#102016] shadow-[0_18px_34px_rgba(35,86,49,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_42px_rgba(35,86,49,0.18)] dark:border-emerald-900/10 dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
								>
									{confirmedTrackUri === item?.uri ? (
										<>
											<span className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-transparent animate-[successTrace_1.5s_ease-out_both]" />
											<span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#22c55e] text-lg font-black text-white shadow-[0_10px_24px_rgba(34,197,94,0.35)] animate-[checkPop_1.25s_ease_both]">
												&#10003;
											</span>
										</>
									) : null}
									<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#102016] ring-1 ring-emerald-900/10">
										{i + 1}
									</span>
									<img
										src={item.image}
										alt="track_img"
										className="h-16 w-16 min-w-16 flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
									/>
									<div className="min-w-0 flex flex-1 flex-col">
										<GlidingText className="pr-1 font-semibold text-[#102016]">
											<strong>{item.track_title}</strong>
										</GlidingText>
										<GlidingText className="mt-1 text-sm text-[#294734]">
											{item?.artists.map((artist) => artist.name).join(", ")}
										</GlidingText>
									</div>
								</a>
								<div className="flex min-w-[7rem] flex-col justify-center gap-2">
									<button
										className="h-10 rounded-2xl border border-emerald-900/10 bg-[#e8f6e2] px-4 text-sm font-semibold text-[#102016] shadow-[0_12px_22px_rgba(35,86,49,0.14)] transition hover:-translate-y-0.5 hover:bg-[#f5fff1] dark:bg-[#e8f6e2] dark:text-[#102016] dark:shadow-[0_12px_22px_rgba(0,0,0,0.22)] dark:hover:bg-[#f5fff1]"
										onClick={() => getURI(item?.uri)}
									>
										Play Song
									</button>
									<div className="relative h-10">
										{activePlaylistTrackUri === item?.uri ? (
											<div className="absolute right-0 top-0 z-50 max-h-44 w-44 overflow-y-auto rounded-2xl border border-emerald-900/10 bg-[#e8f6e2] p-1 text-sm font-semibold text-[#102016] shadow-[0_16px_28px_rgba(0,0,0,0.24)] dark:bg-[#e8f6e2] dark:text-[#102016]">
												<button
													type="button"
													className="flex h-9 w-full items-center justify-center rounded-xl bg-[#fee2e2] text-lg font-bold leading-none text-[#dc2626] transition hover:bg-[#fecaca] hover:text-[#b91c1c]"
													aria-label="Close playlist menu"
													title="Close playlist menu"
													onClick={() => setActivePlaylistTrackUri("")}
												>
													&times;
												</button>
												{playlists?.map((playlist) => (
													<button
														type="button"
														className="block h-9 w-full truncate rounded-xl px-3 text-left transition hover:bg-[#f5fff1]"
														key={playlist.playlistId}
														onClick={() => addTrackToPlaylist(playlist?.playlistId, item?.uri, playlist?.playlistName)}
														title={playlist?.playlistName}
													>
														{playlist?.playlistName}
													</button>
												))}
											</div>
										) : (
											<button
												className="h-10 w-full rounded-2xl border border-emerald-900/10 bg-[#e8f6e2] px-4 text-sm font-semibold text-[#102016] shadow-[0_12px_22px_rgba(35,86,49,0.14)] transition hover:-translate-y-0.5 hover:bg-[#f5fff1] dark:bg-[#e8f6e2] dark:text-[#102016] dark:shadow-[0_12px_22px_rgba(0,0,0,0.22)] dark:hover:bg-[#f5fff1]"
												onClick={() => showPlaylistDropdown(item?.uri)}
											>
												Add song
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
			{toastMessages.length > 0 ? (
				<div className="fixed bottom-6 right-6 z-[80] flex max-w-[calc(100vw-3rem)] flex-col-reverse gap-2">
					{toastMessages.map((toast) => (
						<div
							key={toast.id}
							className="rounded-2xl border border-emerald-900/10 bg-[#e8f6e2] px-5 py-3 text-sm font-bold text-[#102016] shadow-[0_18px_36px_rgba(0,0,0,0.22)] animate-[toastIn_.25s_ease_both] dark:bg-[#e8f6e2] dark:text-[#102016]"
						>
							{toast.message}
						</div>
					))}
				</div>
			) : null}
		</>
	);
};
