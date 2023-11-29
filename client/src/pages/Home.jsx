import "../styles/UserTopSongsStyles.css";
import "../styles/Feedback.css";
import { UserTopSongs } from "../components/UserTopSongs";
import { User } from "../components/User";

export const Home = () => {
    return(
        <div className="home-container">
            <h1>Home Page</h1>
            <User />
            <UserTopSongs />
        </div>
    );
}