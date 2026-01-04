import axios from "axios";
import type { Topic } from "./types";

export const TOPICS: readonly Topic[] = [
	"technology",
	"health",
	"science",
	"art",
	"history",
	"sports",
	"music",
	"travel",
	"food",
	"education",
	"finance",
	"environment",
	"politics",
	"culture",
	"literature",
	"photography",
] as const;

export const api = axios.create({
	baseURL: "http://localhost:8080",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});
