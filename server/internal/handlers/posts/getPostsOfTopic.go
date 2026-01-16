package posts

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
)

func GetPostsOfTopic(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		topic := c.Param("topic")

		var userId *int
		isAuthenticated, exists := c.Get("isAuthenticated")
		if exists && isAuthenticated.(bool) {
			userVal, userExists := c.Get("user")
			if userExists {
				user := userVal.(models.User)
				userId = &user.ID
			}
		}
		// if a user is authenticated, userId points to a int
		// if not, it is nil

		rows, err := pool.Query(
			c.Request.Context(),
			`SELECT
				p.id, t.name, p.title, p.description, p.posted_on AT TIME ZONE 'Asia/Singapore' as posted_on,
				u.id, u.username,
				COUNT(DISTINCT c.id) AS comment_count,
				(SELECT COALESCE(SUM(vote_type), 0) FROM post_votes pv WHERE pv.post_id = p.id) AS vote_score,
				(
					SELECT COALESCE(
						(SELECT vote_type FROM post_votes pv WHERE pv.post_id = p.id AND pv.user_id = $2),
						CASE WHEN $2 IS NOT NULL THEN 0 ELSE NULL END
					)
				) AS user_vote
			FROM posts p
			JOIN users u
				ON p.posted_by = u.id
			LEFT JOIN comments c
				ON c.post_id = p.id
			LEFT JOIN topics t
				ON p.topic = t.id
			WHERE t.name = $1
			GROUP BY p.id, t.name, p.title, p.description, p.posted_on, u.id, u.username
			ORDER BY p.posted_on DESC`,
			topic,
			userId,
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
