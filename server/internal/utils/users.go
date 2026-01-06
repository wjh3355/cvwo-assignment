package utils

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
)

func Authenticate(pool *pgxpool.Pool, username string, password string, ctx context.Context) (models.User, error) {

	fmt.Println("Authenticating user:", username)

	var user models.User

	err := pool.QueryRow(
		ctx,
		"SELECT id, username, password_hash FROM users WHERE username=$1",
		username,
	).Scan(&user.ID, &user.Username, &user.PasswordHash)

	if err != nil {
		if err.Error() == "no rows in result set" {
			fmt.Println("User not found:", username)
			return models.User{}, nil
		}
		fmt.Println("Error querying user:", err)
		return models.User{}, err
	}

	if !CheckPasswordHash(password, user.PasswordHash) {
		fmt.Println("Password mismatch for user:", username)
		return models.User{}, nil
	}

	fmt.Println("User authenticated:", username)

	return user, nil
}
