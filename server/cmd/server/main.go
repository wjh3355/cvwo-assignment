package main

import (
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"log"
	"time"

	"server/internal/db"
	"server/internal/handlers/auth"
	"server/internal/handlers/posts"
	"server/internal/middleware"
)

func main() {

	// load environment variables
	godotenv.Load()

	// initialize database connection pool
	pool, err := db.NewPostgresPool()
	if err != nil { log.Fatal(err) }
	defer pool.Close()

	// check whether a JWT_SECRET env variable is set
	secret := os.Getenv("JWT_SECRET")
	fmt.Println(secret)
	if secret == "" { log.Fatal("JWT_SECRET environment variable is not set") }
	jwtSecret := []byte(secret)

	// set gin to release mode for production
	// gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	
	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PATCH"},
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

	/////////////////////////////////////
	// AUTHENTICATION ENDPOINTS
	/////////////////////////////////////

	// login endpoint
	r.POST("/login", auth.Login(pool, jwtSecret))

	// check auth endpoint
	r.GET("/check-auth", auth.CheckAuth(jwtSecret))

	// logout endpoint
	r.POST("/logout", auth.Logout())

	// endpoints using soft auth

	soft := r.Group("/")
	soft.Use(middleware.SoftAuthMiddleware(jwtSecret))

	/////////////////////////////////////
	// POSTS ENDPOINTS
	/////////////////////////////////////

	// get posts of specific topic endpoint
	soft.GET("/posts/:topic", posts.GetPostsOfTopic(pool))

	/////////////////////////////////////
	// COMMENTS ENDPOINTS
	/////////////////////////////////////

	// get comments of specific post endpoint
	soft.GET("/comments/:postId", posts.GetCommentsofPost(pool))

	// run the server at port 8080
	r.Run(":8080")
}
