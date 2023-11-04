import axios from "axios";
import { useState, useEffect } from "react";

export const User = () => {
	const [user, setUser] = useState();

	const getUserInfo = async (accessToken) => {
		try {
			const res = await axios.get("http://localhost:3001/user", {
				params: { accessToken },
			});
			setUser(res.data);
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
			<h3>
				Hi <img src={user?.image} alt="user pic" width={30} height={30} />
				{user?.name}
			</h3>
		</div>
	);
};
