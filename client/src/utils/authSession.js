import { clearLocalStorageExceptTheme } from "./storage";

export const isAuthExpiredError = (err) => {
	return (
		err?.response?.status === 401 ||
		err?.response?.data?.code === "SPOTIFY_AUTH_EXPIRED"
	);
};

export const logoutForExpiredSession = () => {
	sessionStorage.clear();
	clearLocalStorageExceptTheme();
	window.location.href = "/";
};

export const logoutIfAuthExpired = (err) => {
	if (!isAuthExpiredError(err)) return false;

	logoutForExpiredSession();
	return true;
};
