const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
	cors({
		origin: "http://localhost:3000",
        methods: ["GET", "POST"]
	})
);

app.get("/", (req, res) => {
	res.json({
		msg: "YOU HAVE REACHED THE SERVER!",
	});
});

// returns the user client id and client secret from their spotify account
const credentials = require('./routes/credentials');
app.use('/client', credentials);

// authorize the user through spotify's authorize api
const loginUser = require('./routes/login');
app.use('/login', loginUser);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
