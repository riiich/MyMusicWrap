import { clientCredentials } from "../credentials";

export const Dashboard = ({ code }) => {
	const accessToken = clientCredentials(code); // this access token allows us to do things with spotify api

	console.log(code);
	console.log(accessToken);

	if (!accessToken) return;
	else {
		// Try to store the access token in *local storage* here so that it can be accessed
		//	anywhere within the application through the local storage. Try this solution to
		//	avoid adding all components into this component just to access the access token
		sessionStorage.setItem("accessToken", accessToken);
	}
};
