import { TOPICS } from "./consts";
import type { Topic } from "./types";

export function capitalise(str: string): string {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidTopic(t: string | undefined): t is Topic {
   return t !== undefined && TOPICS.includes(t as Topic);
}