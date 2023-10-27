export const ListTracks = ({ userInfo }) => {
	return (
		<div className="list-container">
			{userInfo?.map((item, i) => (
				<div className="single-item" key={i}>
					<a href="#">
						<img src={item?.image} alt="track_pic" width={75} height={75} />
						<p>{item?.artists?.name}</p>
						<p>
							{i + 1}. {item?.title}
						</p>
					</a>
				</div>
			))}
		</div>
	);
};
