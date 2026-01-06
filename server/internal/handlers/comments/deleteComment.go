package comments

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DeleteCommentRequest struct {
	CommentID int `json:"commentId"`
}

func DeleteComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`
		DELETE FROM comments
		WHERE id = $1 AND commented_by = $2;
		`,
		func(req DeleteCommentRequest, userID int) []any {
			return []any{req.CommentID, userID}
		},
		"Delete Comment",
	)
}
