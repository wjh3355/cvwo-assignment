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
	id: string; // unique identifier
	topic: Topic;
	postedBy: User;
	postedOn: Date;
	title: string;
	description: string;
   commentCount: number;
   upvoters: string[]; // array of user IDs who upvoted
   downvoters: string[]; // array of user IDs who downvoted
};

export type Comment = {
	postId: string; // associated post identifier
	id: string; // unique identifier
	commentedBy: User;
	commentedOn: Date;
	content: string;
	upvoters: string[];
	downvoters: string[];
};

export interface LoginFields {
   username: string;
   password: string;
}

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
