export const ListTracks = ({ userInfo, loading }) => {
	return (
		<div className="tracks-container">
			{loading ? (
				<h3>Loading...</h3>
			) : (
				userInfo?.map((item, i) => (
					<div className="single-item" key={i}>
						<a href={item.trackURL} target="_blank" rel="noopener noreferrer">
							<img src={item?.image} alt="track_pic" width={65} height={65} />
							<p>{item?.artists?.name}</p>
							<p>
								{i + 1}. {item?.title}
							</p>
						</a>
					</div>
				))
			)}
		</div>
	);
};
