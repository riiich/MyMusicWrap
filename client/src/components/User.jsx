import axios from "axios";
import { useState, useEffect } from "react";

export const User = () => {
	const [user, setUser] = useState();

	const getUserInfo = async (accessToken) => {
		try {
			// const res = await axios.get("https://mymusicwrap.onrender.com/user", {
			// const res = await axios.get("https://my-music-wrap-server.vercel.app/user", {
				const res = await axios.get("http://localhost:3001/user", {
				params: { accessToken },
			});
			setUser(res.data);

			// store user info in session storage
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
			{sessionStorage.getItem("userName") || sessionStorage.getItem("code") ? (
				<h3>
					Hi &nbsp;
					<img src={user?.image} alt="user pic" width={30} height={30} />
					{user?.name}!
				</h3>
			) : (
				<>
					<p>**** Please authorize in the top right to use to continue. ****</p>
					<p>
						<small>
							If you cannot log in to another account, please log out of your current Spotify
							account{" "}
							<a href="https://spotify.com/" target="_blank" rel="noreferrer">
								here.
							</a>
						</small>
					</p>
				</>
			)}
		</div>
	);
};
