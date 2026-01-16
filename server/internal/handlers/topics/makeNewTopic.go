package topics

import (
	"server/internal/handlers/shared"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NewTopicRequest struct {
	Name string `json:"name"`
}

func MakeNewTopic(pool *pgxpool.Pool) gin.HandlerFunc {
	return shared.GenericDBHandler(
		pool,
		`INSERT INTO topics (name) VALUES ($1);`,
		func(req NewTopicRequest, userID int) []any {
			return []any{req.Name}
		},
		"Make New Topic",
	)
}
