export const List = ({ userInfo }) => {
	return (
		<div className="list-container">
			{userInfo?.map((item) => (
				<p>{item}</p>
			))}
		</div>
	);
};
