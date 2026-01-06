package posts

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DeletePostRequest struct {
	PostID int `json:"postId"`
}

func DeletePost(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`
		UPDATE posts
		SET posted_by = -999, description = '[Content deleted]'
			WHERE id = $1 AND posted_by = $2
		`,
		func(req DeletePostRequest, userID int) []any {
			return []any{req.PostID, userID}
		},
		"Delete Post",
	)
}
