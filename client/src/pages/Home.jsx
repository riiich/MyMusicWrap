import { UserTopSongs } from "../components/UserTopSongs";
import { User } from "../components/User";

export const Home = () => {
	return (
		<div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
			<div className="mx-auto flex w-full flex-col gap-6">
				<User />
				<UserTopSongs />
			</div>
		</div>
	);
};
