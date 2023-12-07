import axios from "axios";
import { useState, useEffect } from "react";

export const User = () => {
	const [user, setUser] = useState();

	const getUserInfo = async (accessToken) => {
		try {
			const res = await axios.get("http://ec2-54-153-81-155.us-west-1.compute.amazonaws.com:3001/user", {
				params: { accessToken },
			});
			setUser(res.data);
			sessionStorage.setItem("userName", res.data?.name);
			sessionStorage.setItem("userID", res.data?.id);
			sessionStorage.setItem("userSpotifyURL", res.data?.userSpotify);
		} catch (err) {
			console.log("Error getting user info", err);
		}
	};

	useEffect(() => {
		if (!sessionStorage.getItem("accessToken")) return;

		getUserInfo(sessionStorage.getItem("accessToken"));
	}, []);

	return (
		<div className="user-intro">
			{sessionStorage.getItem("userName") ? (
				<h3>
					Hi &nbsp;
					<img src={user?.image} alt="user pic" width={30} height={30} />
					{user?.name}!
				</h3>
			) : (
				<p>**** Please authorize in the top right to use to continue. ****</p>
			)}
		</div>
	);
};
