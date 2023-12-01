const router = require("express").Router();
require("dotenv").config();

router.use("/", (req, res, next) => {
	console.log("Retrieving credentials");

	next();
});

router.get("/", (req, res) => {
	try {
		res.json({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			status: 200,
		});
	} catch (err) {
		res.json({
			status: 400,
			msg: "Does not exist!",
		});
		console.log(err);
	}
});

module.exports = router;
