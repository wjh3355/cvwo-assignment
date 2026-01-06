package comments

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NewCommentRequest struct {
	PostID  int `json:"postId"`
	Content string `json:"content"`
}

func MakeNewComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`INSERT INTO comments (post_id, commented_by, content) VALUES ($1, $2, $3);`,
		func(req NewCommentRequest, userID int) []any {
			return []any{req.PostID, userID, req.Content}
		},
		"Make New Comment",
	)
}
