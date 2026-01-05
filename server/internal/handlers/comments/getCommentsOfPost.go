package comments

import (
	"fmt"
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetCommentsofPost(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		postId := c.Param("postId")

		var currUserIfAny models.User
		isAuthenticated, exists := c.Get("isAuthenticated")
		if exists && isAuthenticated.(bool) {
			userVal, userExists := c.Get("user")
			if userExists {
				currUserIfAny = userVal.(models.User)
			}
		}

		rows, err := pool.Query(
			c.Request.Context(),
			`SELECT
				c.id, c.post_id, c.content, c.commented_on AT TIME ZONE 'Asia/Singapore' as commented_on,
				u.id, u.username,
				(SELECT COALESCE(SUM(vote_type), 0) FROM comment_votes cv WHERE cv.comment_id = c.id) AS vote_score,
				(
					SELECT COALESCE(
						(SELECT vote_type FROM comment_votes cv WHERE cv.comment_id = c.id AND cv.user_id = $2),
						CASE WHEN $2 IS NOT NULL THEN 0 ELSE NULL END
					)
				) AS user_vote
			FROM comments c
			INNER JOIN users u
				ON c.commented_by = u.id 
			WHERE c.post_id=$1 
			ORDER BY c.commented_on DESC`,
			postId,
			currUserIfAny.ID,
		)
		if err != nil {
			fmt.Println("Error querying comments by post ID:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			c.Abort()
			return
		}
		defer rows.Close()

		// ensures empty array instead of nil is returned
		comments := []models.Comment{}

		for rows.Next() {
			var cmt models.Comment
			err := rows.Scan(
				&cmt.ID,
				&cmt.PostID,
				&cmt.Content,
				&cmt.CommentedOn,
				&cmt.CommentedBy.ID,
				&cmt.CommentedBy.Username,
				&cmt.VoteScore,
				&cmt.UserVote,
			)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "huhhh"})
			}
			comments = append(comments, cmt)
		}

		fmt.Println("Retrieved comments for post ID:", postId)
		fmt.Printf("Number of comments retrieved: %v \n", len(comments))
		c.JSON(http.StatusOK, comments)

	}
}
