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

const topUserPlaylist = require("./routes/userPlaylist");
app.use("/mostlistened", topUserPlaylist);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
