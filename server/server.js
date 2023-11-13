const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		msg: "YOU HAVE REACHED THE SERVER!",
	});
});

// returns the user client id and client secret from their spotify account
const credentials = require("./routes/credentials");
app.use("/client", credentials);

// authorize the user through spotify's authorize api
const loginUser = require("./routes/login");
app.use("/login", loginUser);

const refresh = require("./routes/refresh");
app.use("/refresh", refresh);

const authenticatedUser = require("./routes/userInfo");
app.use("/user", authenticatedUser);

const topUserInfo = require("./routes/topUserInfo");
app.use("/mostlistened", topUserInfo);

const userPlaylists = require("./routes/userPlaylists");
app.use("/myplaylists", userPlaylists);

// const songLyrics = require("./routes/lyrics");
// app.use("/lyrics", songLyrics);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
