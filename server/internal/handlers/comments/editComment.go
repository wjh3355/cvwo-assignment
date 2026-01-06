package comments

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EditCommentRequest struct {
	CommentID  int `json:"commentId"`
	NewContent string `json:"newContent"`
}

func EditComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`
		UPDATE comments
		SET content = $1
		WHERE id = $2 AND commented_by = $3;
		`,
		func(req EditCommentRequest, userID int) []any {
			return []any{req.NewContent, req.CommentID, userID}
		},
		"Edit Comment",
	)
}
