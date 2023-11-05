export const ListArtists = ({ userInfo, loading }) => {
	return (
		<div className="top-artists-container">
			{loading ? (
				<h3>Loading...</h3>
			) : (
				userInfo?.map((item, i) => (
					<div className="single-item" key={i}>
						<a href={item.artistURL} target="_blank" rel="noopener noreferrer">
							<img src={item?.image} alt={item.artist} width="100px" height="100px" />
							<p>
								{i + 1}. {item?.artist}
							</p>
						</a>
					</div>
				))
			)}
		</div>
	);
};
