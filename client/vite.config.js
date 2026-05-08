import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	esbuild: {
		loader: "jsx",
		include: /src\/.*\.[jt]sx?$/,
		exclude: [],
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "jsx",
				".jsx": "jsx",
			},
		},
	},
	server: {
		host: "127.0.0.1",
		port: 3000,
	},
	preview: {
		host: "127.0.0.1",
		port: 3000,
	},
	build: {
		outDir: "build",
	},
});
