package comments

import (
	"fmt"
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NewCommentRequest struct {
	PostID  string `json:"postId"`
	Content string `json:"content"`
}

func MakeNewComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		var req NewCommentRequest
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
				INSERT INTO comments (post_id, commented_by, content)
				VALUES ($1, $2, $3, $4);
			`,
			req.PostID,
			user.ID,
			req.Content,
		)

		if err != nil {
			fmt.Println("Error creating new comment:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
			c.Abort()
			return
		}

		fmt.Println("New comment created successfully in post #"+req.PostID+", content:", req.Content)

		c.JSON(http.StatusOK, gin.H{"message": "Comment created successfully"})

	}
}
