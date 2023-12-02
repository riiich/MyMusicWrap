export const About = () => {
	return (
		<div className="about">
			<div className="about-content">
				<h1>What is SpotifyMe?</h1>
				<p>
					SpotifyMe was inspired by that one thing we all wait for towards the end of the year,{" "}
					<strong>Spotify Wrapped</strong>! Aren't we curious as to how our music tastes and genre
					changes through the weeks, months, and even throughout the years? I know I am.
				</p>
				<p>
					I wanted to make this web application as simple to use as possible, so for now, you are
					able to do the following: select a time frame, which ranges from short term (around 4
					weeks) to medium term (around 6 months) to long term (over 1 year), you would like to view
					which artists and tracks you've listened to, and based on the current time frame of the
					tracks you've selected, there will be songs recommended to you. You can determine if you
					like the recommended song by pressing the{" "}
					<code>
						<i>Play Song</i>
					</code>{" "}
					button, and if you do, you can add it to any of your owned playlists by pressing the{" "}
					<code>
						<i>Add Song</i>
					</code>{" "}
					button. If you have any questions, comments, or suggestions for this application, please
					head over to the <a href="/userfeedback" className="a-feedback">Feedback</a> page.
				</p>
				<p>Thanks!</p>
			</div>
			<div className="error-fixes">
				<h1>Potential Possible Error Fixes</h1>
				<p>
					If you ever encounter an error that relates to nothing loading onto the screen, it's most
					likely not an error on your end, but the servers.
				</p>
                <p>
                    If nothing is loading and the <code><i>Sign out</i></code> button is still appears on the 
                    top right, simply click <code><i>Sign out</i></code> and re-authorize. 
                </p>
                <p>
                    If you encounter any other problems/errors, it would be really appreciated if you let me know
                    via the <a href="/userfeedback" className="a-feedback">Feedback</a> page.
                </p>
			</div>
			<img src={require("../images/og-dancing-plant-pepe.gif")} alt="pepe" width={300} height={300} />
		</div>
	);
};
