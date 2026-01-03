package handlers

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func CheckAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := ""

		authHeader := c.GetHeader("Authorization")

		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			if cookie, err := c.Cookie("token"); err == nil {
				tokenStr = cookie
			}
		}

		if tokenStr == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token not provided"})
			c.Abort()
			return
		}

		claims := &JWTClaims{}

		token, err := jwt.ParseWithClaims(
			tokenStr, 
			claims, 
			func(token *jwt.Token) (any, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrTokenMalformed
				}
				return []byte(os.Getenv("JWT_SECRET")), nil
			},
		)

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization token"})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"user_id":  (*claims).UserID,
			"username": (*claims).Username,
		})
	}
}
