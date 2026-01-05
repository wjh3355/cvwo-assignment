package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/utils"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Username string `json:"username"`
	ID       int    `json:"id"`
}

type JWTClaims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func Login(pool *pgxpool.Pool, jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			fmt.Println("Invalid login request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		user, err := utils.Authenticate(pool, req.Username, req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			c.Abort()
			return
		}

		if user.ID == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			c.Abort()
			return
		}

		// Create JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTClaims{
			UserID:   user.ID,
			Username: user.Username,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expires in 24 hours
				IssuedAt:  jwt.NewNumericDate(time.Now()),
			},
		})

		tokenString, err := token.SignedString(jwtSecret)

		if err != nil {
			fmt.Println("Error generating token:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			c.Abort()
			return
		}

		fmt.Println("User logged in:", user.Username)

		c.SetCookie(
			"forum_token",                 // cookie name
			tokenString,                   // value
			86400,                         // max age (seconds)
			"/",                           // path
			"",                            // domain (empty = current)
			gin.Mode() == gin.ReleaseMode, // secure (true in production HTTPS)
			true,                          // httpOnly
		)

		c.JSON(http.StatusOK, LoginResponse{
			Username: user.Username,
			ID:       user.ID,
		})
	}
}
