const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');
const SpotifyWebAPI = require("spotify-web-api-node");

router.use((req, res, next) => {
	console.log("Retrieving user's info!");

	next();
});

router.get('/', (req, res) => {

});

module.exports = router;