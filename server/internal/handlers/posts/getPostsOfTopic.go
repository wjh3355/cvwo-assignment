package posts

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
	"server/internal/utils"
)

func GetPostsOfTopic(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		topic := c.Param("topic")

		if !utils.ValidTopics[topic] {
			fmt.Printf("Topic '%s' does not exist\n", topic)
			c.JSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("Topic '%s' does not exist", topic),
			})
			c.Abort()
			return
		}

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
				p.id, p.topic, p.title, p.description, p.posted_on AT TIME ZONE 'Asia/Singapore' as posted_on,
				u.id, u.username,
				(SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
				(SELECT COALESCE(SUM(vote_type), 0) FROM post_votes pv WHERE pv.post_id = p.id) AS vote_score,
				(
					SELECT COALESCE(
						(SELECT vote_type FROM post_votes pv WHERE pv.post_id = p.id AND pv.user_id = $2),
						CASE WHEN $2 IS NOT NULL THEN 0 ELSE NULL END
					)
				) AS user_vote
			FROM posts p
			INNER JOIN users u
				ON p.posted_by = u.id 
			WHERE p.topic=$1 
			ORDER BY p.posted_on DESC`,
			topic,
			currUserIfAny.ID,
		)
		if err != nil {
			fmt.Println("Error querying posts by topic:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			c.Abort()
			return
		}
		defer rows.Close()

		// ensures empty array instead of nil is returned
		posts := []models.Post{}

		for rows.Next() {
			var p models.Post
			err := rows.Scan(
				&p.ID,
				&p.Topic,
				&p.Title,
				&p.Description,
				&p.PostedOn,
				&p.PostedBy.ID,
				&p.PostedBy.Username,
				&p.CommentCount,
				&p.VoteScore,
				&p.UserVote,
			)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "huhhh"})
			}
			posts = append(posts, p)
		}

		fmt.Println("Retrieved posts for topic:", topic)
		fmt.Printf("Number of posts retrieved: %v \n", len(posts))

		c.JSON(http.StatusOK, posts)

	}
}
