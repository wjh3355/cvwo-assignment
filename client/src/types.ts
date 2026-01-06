export type User = {
	id: string; // unique identifier
	username: string;
};

export type Topic =
	| "technology"
	| "health"
	| "science"
	| "art"
	| "history"
	| "sports"
	| "music"
	| "travel"
	| "food"
	| "education"
	| "finance"
	| "environment"
	| "politics"
	| "culture"
	| "literature"
	| "photography";

export type Post = {
	id: number; // unique identifier
	topic: Topic;
	postedBy: User;
	postedOn: string;
	title: string;
	description: string;
   commentCount: number;
   voteScore: number;
   userVote: number | null; // -1 for downvote, 0 for no vote, 1 for upvote, null if not logged in
};

export type Comment = {
	id: number; // unique identifier
	postId: string; // associated post identifier
	commentedBy: User;
	commentedOn: string;
	content: string;
   voteScore: number;
   userVote: number | null; // -1 for downvote, 0 for no vote, 1 for upvote, null if not logged in
};

export interface LoginFields {
   username: string;
   password: string;
}

export interface RegisterFields {
   username: string;
   password: string;
   confirmPassword: string;
}

export type VoteType = 0 | 1 | -1;

// export type ForumState = {
// 	posts: Record<string, Post>; // keyed by postId
// 	comments: Record<string, Comment[]>; // keyed by postId
// };

// export type ForumContextType = {
// 	posts: ForumState["posts"];
// 	comments: ForumState["comments"];
// 	addPost: (post: Post) => void;
// 	deletePost: (postId: string) => void;
// 	addComment: (comment: Comment) => void;
// 	deleteComment: (commentId: string) => void;
// 	upvoteComment: (commentId: string) => void;
// 	downvoteComment: (commentId: string) => void;
// };
