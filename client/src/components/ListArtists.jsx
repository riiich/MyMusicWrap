export const ListArtists = ({ userInfo }) => {
	return (
		<div className="list-container">
			{userInfo?.map((item, i) => (
				<div className="single-artist">
					<a href="#">
						<img src={item?.image} alt={item.artist} width="100px" height="100px" />
						<p>{i+1}: {item?.artist}</p>
					</a>
				</div>
			))}
		</div>
	);
};
