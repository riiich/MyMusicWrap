const router = require("express").Router();
const Feedback = require("../schema/feedback");

router.use((req, res, next) => {
	console.log("Storing user's feedback for the application!");

	next();
});

router.get("/", (req, res) => {
    res.json({
        status: 200,
        msg: "Hitting feedback endpoint!",
    });
})

router.post("/", async (req, res) => {
    const {feedback, userName, userID, spotifyURL, rating} = req.body;

	try {
        // create a new document and insert into feedback collection
		const critique = await Feedback.create({
            name: userName,
            comment: feedback,
            userID: userID,
            spotifyURL: spotifyURL, 
            createdAt: new Date(),
            rating: rating,
		});
 
        res.status(200).json({
            msg: "Stored"
        });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
