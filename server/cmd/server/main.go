package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"log"
	"time"

	"server/internal/db"
	"server/internal/handlers/auth"
	"server/internal/handlers/posts"
	"server/internal/handlers/comments"
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
	if secret == "" { log.Fatal("JWT_SECRET environment variable is not set") }
	jwtSecret := []byte(secret)

	// set gin to release mode for production
	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	
	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Trusting localhost
	router.SetTrustedProxies([]string{"127.0.0.1"})

	// sanity check endpoint
	router.GET(
		"/health", 
		func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		},
	)

	/////////////////////////////////////
	// AUTHENTICATION ENDPOINTS
	/////////////////////////////////////

	// login endpoint
	router.POST("/login", auth.Login(pool, jwtSecret))

	// check auth endpoint
	router.GET("/check-auth", auth.CheckAuth(jwtSecret))

	// logout endpoint
	router.POST("/logout", auth.Logout())

	soft := router.Group("/")
	soft.Use(middleware.SoftAuthMiddleware(jwtSecret))

	hard := router.Group("/")
	hard.Use(middleware.HardAuthMiddleware(jwtSecret))

	/////////////////////////////////////
	// POSTS ENDPOINTS
	/////////////////////////////////////

	// get posts of specific topic endpoint
	soft.GET("/posts/:topic", posts.GetPostsOfTopic(pool))

	/////////////////////////////////////
	// COMMENTS ENDPOINTS
	/////////////////////////////////////

	// get comments of specific post endpoint
	soft.GET("/comments/:postId", comments.GetCommentsofPost(pool))

	/////////////////////////////////////
	// VOTING ENDPOINTS
	/////////////////////////////////////

	// vote on post endpoint
	hard.POST("/posts/vote", posts.VoteOnPost(pool))

	// vote on comment endpoint
	hard.POST("/comments/vote", comments.VoteOnComment(pool))

	// run the server at port 8080
	router.Run(":8080")
}
