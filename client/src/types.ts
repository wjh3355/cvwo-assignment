export type User = {
	id: string;
	userName: string;
	email: string;
};

export type Topic = "technology" | "health" | "science" | "art" | "history" | "sports" | "music" | "travel" | "food" | "education" | "finance" | "environment" | "politics" | "culture" | "literature" | "photography";

export type Post = {
   id: string;
   postedBy: User;
   postedOn: Date;
   title: string;
   description: string;
   comments: Comment[];
}

export type Comment = {
   id: string;
   commentedBy: User;
   commentedOn: Date;
   content: string;
}
