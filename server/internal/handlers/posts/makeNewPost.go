package posts

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
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
			fmt.Println("Error with request body:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		u, exists := c.Get("user")
		if !exists {
			fmt.Println("User not found in context")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		user := u.(models.User)

		// get the topic id from the topic name
		var topicID int
		err := pool.QueryRow(
			c,
			"SELECT id FROM topics WHERE name=$1",
			req.Topic,
		).Scan(&topicID)
		if err != nil {
			fmt.Println("Error fetching topic ID:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid topic. Might not be created yet?"})
			return
		}

		// insert the new post into the database
		_, err = pool.Exec(
			c,
			"INSERT INTO posts (posted_by, topic, title, description) VALUES ($1, $2, $3, $4)",
			user.ID,
			topicID,
			req.Title,
			req.Description,
		)
		if err != nil {
			fmt.Println("Error inserting new post:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully"})
	}
}
