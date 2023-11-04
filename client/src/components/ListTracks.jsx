export const ListTracks = ({ userInfo, loading }) => {
	return (
		<div className="tracks-container">
			{loading ? (
				<h3>Loading...</h3>
			) : (
				userInfo?.map((item, i) => (
					<div className="single-item" key={i}>
						<a href={item.trackURL} target="_blank" rel="noopener noreferrer">
							<img src={item?.image} alt="track_pic" width={55} height={55} />
							<div key={item.id}>
								<p className="top-track-title">
									<strong>{i + 1}. {item?.title}</strong>
								</p>
								<div className="top-track-artists">
									{item?.artists.map((artist) => (
										<p>&nbsp;{artist.name}</p>
									))}
								</div>
							</div>
						</a>
					</div>
				))
			)}
		</div>
	);
};
