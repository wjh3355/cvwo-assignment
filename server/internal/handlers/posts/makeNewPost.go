package posts

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
	"server/internal/utils"
)

type NewPostRequest struct {
	Topic       string `json:"topic"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func MakeNewPost(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		
		var req NewPostRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			fmt.Println("Invalid new post request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		u, _ := c.Get("user")
		user := u.(models.User)
	}
}