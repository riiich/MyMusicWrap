export const clearLocalStorageExceptTheme = () => {
	const theme = localStorage.getItem("theme");

	localStorage.clear();

	if (theme) {
		localStorage.setItem("theme", theme);
	}
};
