package server

import (
	"github.com/gin-gonic/gin"
	"log"
	"server/internal/db"
)

func main() {

	pool, err := postgres.NewPostgresPool()
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.GET("/users", handlers.GetUsers(pool))
	r.POST("/users", handlers.CreateUser(pool))

	r.Run(":8080")
}
