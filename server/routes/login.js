const router = require("express").Router();
const axios = require("axios");
const UserCount = require("../schema/userCount");
require("dotenv").config();

const querystring = require("node:querystring");

// this package provides helper functions to interact with the Spotify Web API
const SpotifyWebAPI = require("spotify-web-api-node");

router.use(async (req, res, next) => {
	console.log("Authorizing User!");

	try {
		// every time a user logs in, increment by 1 (this is acting like an analytics to determine how people have used to app)
		await UserCount.updateOne({ _id: "6568b47543f2747d63f8e826" }, { $inc: { userCount: 1 } });
	} catch (err) {
		console.log(err);
	}

	next();
});

// *******************
router.get("/authorize", (req, res) => {
	try {
		const auth_query_parameters = new URLSearchParams({
			response_type: "code",
			client_id: process.env.CLIENT_ID,
			scope: "",
			redirect_uri: "http://localhost:3001/login/callback",
		});

		res.redirect("https://accounts.spotify.com/authorize?" + auth_query_parameters.toString());
	} catch (err) {
		console.log(err);
	}
});
 
const tokenURL = "https://accounts.spotify.com/api/token"; 

router.get("/callback", async (req, res) => {
	try {
		const code = req.query.code;

		console.log(code);
 
		const body = new URLSearchParams({
			code: code,
			redirect_uri: "http://localhost:3000",
			grant_type: "authorization_code",
		});

		const response = await axios.post(tokenURL, body, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")
			},
		});

		console.log(response.data);
        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expiresIn: response.data.expires_in
        });

		// res.json({ code: code });
	} catch (err) {
		console.log(err);
	}
});

router.post("/token", (req, res) => {});

//********************

router.post("/", async (req, res) => {
	try {
		const credentials = {
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		};
		console.log("placeholder boop");
		const spotifyAPI = new SpotifyWebAPI(credentials);

		const code = req.body.code;

		const response = await axios.post("https://accounts.spotify.com/api/token", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					new Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString(
						"base64"
					),
			},
			body: {
				credentials,
			},
		});

		console.log(response.data);

		res.json({
			accessToken: response.data.access_token,
			refreshToken: response.data.refresh_token,
			expiresIn: response.data.expires_in,
			msg: "Sucessfully retrieved access token!",
		});

		// spotifyAPI
		// 	.authorizationCodeGrant(code)
		// 	.then((result) => {
		// 		console.log("Successfully logged in!");

		// 		res.json({
		// 			accessToken: result.body.access_token,
		// 			refreshToken: result.body.refresh_token,
		// 			expiresIn: result.body.expires_in,
		// 			msg: "Sucessfully retrieved access token!",
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		res.sendStatus(400);
		// 	});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
