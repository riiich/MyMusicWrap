export const ListTracks = ({ userInfo }) => {
	return (
		<div className="list-container">
			{userInfo?.map((item, i) => (
				<div className="single-artist">
					<a href="#">
						
					</a>
				</div>
			))}
		</div>
	);
};
