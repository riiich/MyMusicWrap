import { UserTopSongs } from "../components/UserTopSongs";
import "../styles/UserTopSongsStyles.css";

export const Home = ({code}) => {
    return(
        <div className="home-container">
            <h1>Home Page</h1>

            <UserTopSongs />
        </div>
    );
}