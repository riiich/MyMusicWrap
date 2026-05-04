import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Feedback = () => {
	const navigate = useNavigate();
	const [appFeedback, setAppFeedback] = useState("");
	const [rating, setRating] = useState("");
	const maxCharacterCount = 300;

	const handleFeedback = (e) => {
		setAppFeedback(e.target.value);
	};

	const handleRating = (e) => {
		setRating(e.target.value);
	};

	const submitFeedback = async () => {
		try {
			if (appFeedback.length === 0) {
				alert("Can't send empty feedback.");
				return;
			}

			const data = await axios.post("http://127.0.0.1:3001/feedback", {
				feedback: appFeedback,
				userName: sessionStorage.getItem("userName"),
				userID: sessionStorage.getItem("userID"),
				spotifyURL: sessionStorage.getItem("userSpotifyURL"),
				rating,
			});

			if (data.data.msg === "Stored") {
				setAppFeedback("");
				setRating("");

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
				<label htmlFor="feedback" id="feedback-prompt">
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
						onChange={handleFeedback}
						value={appFeedback}
					></textarea>
					<p id={appFeedback.length < maxCharacterCount ? "char-count" : "max-char-count"}>
						{appFeedback.length}/{maxCharacterCount} char
					</p>
				</div>
				<div className="user-rating">
					<label htmlFor="rate">How was the app on a scale of 1-5?</label>
					<select id="rate" name="rate" onChange={handleRating} value={rating}>
						<option disabled hidden value="">
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
