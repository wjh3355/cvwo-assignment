package main

import (
	"context"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"log"
	"time"

	"server/internal/handlers/auth"
	"server/internal/handlers/comments"
	"server/internal/handlers/posts"
	"server/internal/handlers/voting"
	"server/internal/middleware"
)

func main() {

	// load environment variables
	godotenv.Load()

	// initialize database connection pool
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}
	pgConfig, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		log.Fatal("Error when creating PostgreSQL pool: ", err)
	}
	pgConfig.MaxConns = 20
	pool, err := pgxpool.NewWithConfig(context.Background(), pgConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	// check whether a JWT_SECRET env variable is set
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}
	jwtSecret := []byte(secret)

	// get frontend url from environment variable
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	// set gin to release mode for production
	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Trusting localhost
	router.SetTrustedProxies([]string{"127.0.0.1"})

	// Middleware to ensure no requests take longer than 3 seconds,
	// which will leave server and client hanging
	router.Use(middleware.TimeOutMiddleware(3))

	api := router.Group("/api")

	// sanity check endpoint
	api.GET(
		"/health",
		func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"health": "alive and kicking"})
		},
	)

	/////////////////////////////////////
	// AUTHENTICATION ENDPOINTS
	/////////////////////////////////////

	// login endpoint
	api.POST("/login", auth.Login(pool, jwtSecret))

	// check auth endpoint
	api.GET("/check-auth", auth.CheckAuth(jwtSecret))

	// logout endpoint
	api.POST("/logout", auth.Logout())

	// register endpoint
	api.POST("/register", auth.Register(pool, jwtSecret))

	soft := api.Group("/")
	soft.Use(middleware.SoftAuthMiddleware(jwtSecret))

	hard := api.Group("/")
	hard.Use(middleware.HardAuthMiddleware(jwtSecret))

	/////////////////////////////////////
	// POSTS ENDPOINTS
	/////////////////////////////////////

	// get posts of specific topic endpoint
	soft.GET("/posts/:topic", posts.GetPostsOfTopic(pool))

	// create post endpoint (REQUIRES AUTH)
	hard.POST("/posts", posts.MakeNewPost(pool))

	// edit post endpoint (REQUIRES AUTH)
	hard.PATCH("/posts", posts.EditPost(pool))

	// (soft) delete post endpoint (REQUIRES AUTH)
	hard.DELETE("/posts", posts.DeletePost(pool))
	// deleted posts are reassigned to a [deleted] user with id = -999

	/////////////////////////////////////
	// COMMENTS ENDPOINTS
	/////////////////////////////////////

	// get comments of specific post endpoint
	soft.GET("/comments/:postId", comments.GetCommentsofPost(pool))

	// create comment endpoint (REQUIRES AUTH)
	hard.POST("/comments", comments.MakeNewComment(pool))

	// edit comment endpoint (REQUIRES AUTH)
	hard.PATCH("/comments", comments.EditComment(pool))

	// delete comment endpoint (REQUIRES AUTH)
	hard.DELETE("/comments", comments.DeleteComment(pool))
	// comments are actually removed from the db

	/////////////////////////////////////
	// VOTING ENDPOINTS
	/////////////////////////////////////

	// vote on post or comment endpoint (REQUIRES AUTH)
	hard.POST("/vote", voting.VoteOnPostOrComment(pool))

	// run the server at port 8080
	router.Run(":8080")
}
