export const RecommendedArtists = ({ userInfo }) => {
	return (
		<div className="list-container">
			{userInfo?.map((item, i) => (
				<div className="single-item" key={i}>
					<a href="#">
						<p>{item}</p>
					</a>
				</div>
			))}
		</div>
	);
};
