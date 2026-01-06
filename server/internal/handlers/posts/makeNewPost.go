package posts

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NewPostRequest struct {
	Topic       string `json:"topic"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func MakeNewPost(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`INSERT INTO posts (topic, posted_by, title, description) VALUES ($1, $2, $3, $4);`,
		func(req NewPostRequest, userID int) []any {
			return []any{req.Topic, userID, req.Title, req.Description}
		},
		"Make New Post",
	)
}