import { clientCredentials } from "../credentials";

export const Dashboard = ({ code }) => {
	// if(!sessionStorage.getItem("code")) sessionStorage.setItem("code", code);
	// else return;
	sessionStorage.setItem("code", code);

	const sessionCode = sessionStorage.getItem("code");
	const accessToken = clientCredentials(code); // this access token allows us to do things with spotify api

	// console.log(sessionCode);
	// console.log(accessToken);

	if (!accessToken) return;
	else {
		// Try to store the access token in *local storage* here so that it can be accessed
		//	anywhere within the application through the local storage. Try this solution to
		//	avoid adding all components into this component just to access the access token
		sessionStorage.setItem("accessToken", accessToken);
	}
};
