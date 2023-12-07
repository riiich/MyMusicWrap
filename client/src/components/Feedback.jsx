import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Feedback = () => {
	const navigate = new useNavigate();
	const [appFeedback, setAppFeedback] = useState("");
	const [rating, setRating] = useState(null);
	const maxCharacterCount = 300;

	const handleFeedback = (e) => {
		setAppFeedback(e.target.value);
		console.log(appFeedback);
	};

	const handleRating = (e) => {
		console.log(`User rating: ${e.target.value}`);
		setRating(e.target.value);
	};

	const submitFeedback = async () => {
		try {
			// alert user if they try to submit without typing anything
			if (appFeedback.length === 0) {
				alert("Can't send empty feedback! 🤬🤬🤬🤦‍♂️🤬🤬🤬");
				return;
			}

			const data = await axios.post("https://mymusicwrap.onrender.com/feedback", {
				feedback: appFeedback,
				userName: sessionStorage?.getItem("userName"),
				userID: sessionStorage?.getItem("userID"),
				spotifyURL: sessionStorage?.getItem("userSpotifyURL"),
				rating: rating,
			});

			if (data.data.msg === "Stored") {
				setAppFeedback("");

				console.log(data.data.msg);
				console.log("The server got the feedback comment! NICEEEEE!!");
				setRating(null);

				setTimeout(() => {
					navigate("/");
				}, 1500);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<h1>Feedback Page</h1>
			<div className="user-feedback">
				<label for="feedback" id="feedback-prompt">
					Any questions, comments, or suggestions of the application.
				</label>
				<div className="feedback-content">
					<textarea
						id="feedback"
						name="feedback"
						cols="50"
						rows="13"
						placeholder="       Questions, comments, or suggestions..."
						maxLength={maxCharacterCount}
						onChange={(e) => handleFeedback(e)}
					></textarea>
					<p id={appFeedback.length < maxCharacterCount ? "char-count" : "max-char-count"}>
						{appFeedback.length}/{maxCharacterCount} char
					</p>
				</div>
				<div className="user-rating">
					<label>How was the app on a scale of 1-5?</label>
					<select name="rate" onChange={(e) => handleRating(e)} value={rating}>
						<option disabled="" selected="" hidden value={null}>
							Select a rating
						</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</select>
				</div>
				<input type="submit" value="Submit" onClick={submitFeedback} />
			</div>
		</>
	);
};
