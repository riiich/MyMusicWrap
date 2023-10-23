import React from "react";
import { useState, useEffect } from "react";
import { clientCredentials } from "../credentials";
import { SearchBar } from "./SearchBar";
import { UserTopSongs } from "./UserTopSongs";
import { Container } from "react-bootstrap";

/*
    // grab user's playlist and get the top listened songs
*/

export const Dashboard = ({ code }) => {
	const accessToken = clientCredentials(code); // this access token allows us to do things with spotify api

    if(!accessToken) return;

	return (
		<div>
			{/* <SearchBar aToken={accessToken} /> */}
			<UserTopSongs accessToken={accessToken} />
		</div>
	);
};
