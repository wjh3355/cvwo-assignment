package utils

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
)

func Authenticate(pool *pgxpool.Pool, username string, password string) (models.User, error) {

	fmt.Println("Authenticating user:", username)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var user models.User

	err := pool.QueryRow(
		ctx,
		"SELECT id, username, password_hash FROM users WHERE username=$1",
		username,
	).Scan(&user.ID, &user.Username, &user.Password)

	if err != nil {
		if err.Error() == "no rows in result set" {
			fmt.Println("User not found:", username)
			return models.User{}, nil
		}
		fmt.Println("Error querying user:", err)
		return models.User{}, err
	}

	if !CheckPasswordHash(password, user.Password) {
		fmt.Println("Password mismatch for user:", username)
		return models.User{}, nil
	}

	fmt.Println("User authenticated:", username)

	return user, nil
}

// func CreateUser(pool *pgxpool.Pool) gin.HandlerFunc {
// 	type request struct {
// 		Name  string `json:"name" binding:"required"`
// 		Email string `json:"email" binding:"required,email"`
// 	}

// 	return func(c *gin.Context) {
// 		var req request
// 		if err := c.ShouldBindJSON(&req); err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 			return
// 		}

// 		ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
// 		defer cancel()

// 		_, err := pool.Exec(
// 			ctx,
// 			"INSERT INTO users (name, email) VALUES ($1, $2)",
// 			req.Name,
// 			req.Email,
// 		)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}

// 		c.Status(http.StatusCreated)
// 	}
// }
