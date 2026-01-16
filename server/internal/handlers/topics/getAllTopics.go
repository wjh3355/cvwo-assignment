package topics

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetAllTopics(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		rows, err := pool.Query(
			c,
			`SELECT name FROM topics ORDER BY name;`,
		)
		if err != nil {
			fmt.Println("Error getting all topics:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			c.Abort()
			return
		}
		defer rows.Close()

		// ensures empty array instead of nil is returned
		topics := []string{}

		for rows.Next() {
			var topic string
			err := rows.Scan(
				&topic,
			)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "huhhh"})
			}
			topics = append(topics, topic)
		}

		fmt.Printf("Num of topics retrieved: %v \n", len(topics))
		c.JSON(http.StatusOK, topics)

	}
}
