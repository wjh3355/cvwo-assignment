package shared

import (
	"fmt"
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GenericDBHandler[T any](
	pool *pgxpool.Pool,
	pgquery string,
	getArgs func(req T, userID int) []any,
	operation string,
) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req T
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		u, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		user := u.(models.User)

		if _, err := pool.Exec(c, pgquery, getArgs(req, user.ID)...); err != nil {
			fmt.Println("Database error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("%s operation for user %s (ID %d) failed", operation, user.Username, user.ID)})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("%s operation for user %s (ID %d) was successful", operation, user.Username, user.ID)})
	}
}
