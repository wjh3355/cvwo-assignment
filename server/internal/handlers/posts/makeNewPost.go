package posts

import (
	"fmt"
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
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

		_, err := pool.Exec(
			c,
			`
				INSERT INTO posts (topic, posted_by, title, description)
				VALUES ($1, $2, $3, $4);
			`,
			req.Topic,
			user.ID,
			req.Title,
			req.Description,
		)

		if err != nil {
			fmt.Println("Error creating new post:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			c.Abort()
			return
		}

		fmt.Println("New post created successfully, title:", req.Title)

		c.JSON(http.StatusOK, gin.H{"message": "Post created successfully"})

	}
}
