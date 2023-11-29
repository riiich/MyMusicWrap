const router = require("express").Router();
// const mongoose = require("mongoose");
const Feedback = require("../schema/feedback");

router.use((req, res, next) => {
	console.log("Storing user's feedback for the application!");

	next();
});

router.post("/", async (req, res) => {
	try {
        // create a new document and insert into feedback collection
		const critique = await Feedback.create({
            name: req.body.userName,
            comment: req.body.feedback,
            userID: req.body.userID,
            createdAt: new Date(),
            rating: req.body.rating,
		});
 
        res.status(200).json({
            msg: "Stored"
        });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
