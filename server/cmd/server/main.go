package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"log"
	"time"

	"server/internal/db"
	"server/internal/handlers"
)

func main() {

	// initialize database connection pool
	pool, err := db.NewPostgresPool()
	if err != nil { log.Fatal(err) }
	defer pool.Close()

	// set gin to release mode for production
	// gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	
	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Trusting localhost
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// sanity check endpoint
	r.GET(
		"/health", 
		func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		},
	)

	// r.GET("/users", handlers.GetUsers(pool))
	// r.POST("/users", handlers.CreateUser(pool))

	/////////////////////////////////////
	// AUTHENTICATION ENDPOINTS
	/////////////////////////////////////

	// login endpoint
	r.POST("/login", handlers.Login(pool))

	// check auth endpoint
	r.GET("/check-auth", handlers.CheckAuth())

	// logout endpoint
	r.POST("/logout", handlers.Logout())

	// run the server at port 8080
	r.Run(":8080")
}
