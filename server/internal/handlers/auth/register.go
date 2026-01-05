package auth

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
	"server/internal/utils"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(pool *pgxpool.Pool, jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			fmt.Println("Invalid register request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		passwordHash, err := utils.HashPassword(req.Password)
		if err != nil {
			fmt.Println("Error hashing password:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
			c.Abort()
			return
		}

		var newUser models.User

		err2 := pool.QueryRow(
			c,
			`
				INSERT INTO users (username, password_hash)
				VALUES ($1, $2)
				RETURNING id, username;
			`,
			req.Username,
			passwordHash,
		).Scan(&newUser.ID, &newUser.Username)

		if err2 != nil {
			fmt.Println("Error creating user:", err2)
			if strings.Contains(err2.Error(), "23505") {
				c.JSON(http.StatusConflict, gin.H{"error": "This username is already taken"})
				c.Abort()
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			c.Abort()
			return
		}

		// Create JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTClaims{
			UserID:   newUser.ID,
			Username: newUser.Username,
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

		fmt.Println("Created user and logging them in:", newUser.Username)

		c.SetCookie(
			"forum_token",          		// cookie name
			tokenString,             		// value
			86400,                   		// max age (seconds)
			"/",                     		// path
			"",                      		// domain (empty = current)
			gin.Mode() == gin.ReleaseMode,// secure (true in production HTTPS)
			true,                    		// httpOnly
		)
		
		c.JSON(http.StatusOK, LoginResponse{
			Username: newUser.Username,
			ID: newUser.ID,
		})
	}
}