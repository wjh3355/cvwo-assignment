package posts

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EditPostRequest struct {
	PostID         int `json:"postId"`
	NewTitle       string `json:"newTitle"`
	NewDescription string `json:"newDescription"`
}

func EditPost(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`
		UPDATE posts
		SET title = $1, description = $2
		WHERE id = $3 AND posted_by = $4;
		`,
		func(req EditPostRequest, userID int) []any {
			return []any{req.NewTitle, req.NewDescription, req.PostID, userID}
		},
		"Edit Post",
	)
}
