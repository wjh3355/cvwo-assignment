package middleware


import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"server/internal/handlers/auth"
	"server/internal/models"
)

func SoftAuthMiddleware(jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {

		user := models.User{} 

		tokenStr, err := c.Cookie("forum_token")

		if err != nil {
			c.Set("user", user)
			c.Set("isAuthenticated", false)
			c.Next()
			return
		}

		claims := &auth.JWTClaims{}

		token, err := jwt.ParseWithClaims(
			tokenStr, 
			claims, 
			func(token *jwt.Token) (any, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrTokenMalformed
				}
				return jwtSecret, nil
			},
		)

		if err != nil || !token.Valid {
			c.Set("user", user)
			c.Set("isAuthenticated", false)
			c.Next()
			return
		}

		user.ID = claims.UserID
		user.Username = claims.Username

		fmt.Println("User authenticated in middleware:", user.Username)

		c.Set("user", user)
		c.Set("isAuthenticated", true)
		c.Next()
	}
}
