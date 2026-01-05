package models

import (
	"time"
)

type User struct {
	ID           int    `json:"id" db:"id"`
	Username     string `json:"username" db:"username"`
	PasswordHash string `json:"-" db:"password_hash"`
}

type Post struct {
	ID           int       `json:"id" db:"id"`
	Topic        string    `json:"topic" db:"topic"`
	PostedBy     User      `json:"postedBy" db:"posted_by"`
	PostedOn     time.Time `json:"postedOn" db:"posted_on"`
	Title        string    `json:"title" db:"title"`
	Description  string    `json:"description" db:"description"`
	CommentCount int       `json:"commentCount" db:"comment_count"`
	VoteScore    int       `json:"voteScore" db:"vote_score"`
	UserVote     *int      `json:"userVote" db:"user_vote"` // 1 or -1 or 0 (if user is logged in) or null (if user not logged in)
}

type Comment struct {
	ID          int       `json:"id" db:"id"`
	PostID      int       `json:"postId" db:"post_id"`
	CommentedBy User      `json:"commentedBy" db:"commented_by"`
	CommentedOn time.Time `json:"commentedOn" db:"commented_on"`
	Content     string    `json:"content" db:"content"`
	VoteScore   int       `json:"voteScore" db:"vote_score"`
	UserVote    *int      `json:"userVote" db:"user_vote"` // 1 or -1 or 0 (if user is logged in) or null (if user not logged in)
}
