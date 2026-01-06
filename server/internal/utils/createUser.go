package utils

import (
	"context"
	"fmt"
	"server/internal/db"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func CreateUser(username string, password string, id int) {

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	pool, err := db.NewPostgresPool()
	if err != nil {
		panic(err)
	}
	defer pool.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err = pool.Exec(
		ctx,
		`
			INSERT INTO users (username, password_hash, id)
			VALUES ($1, $2, $3);
		`,
		username,
		string(hash),
		id,
	)

	if err != nil {
		panic(err)
	}

	fmt.Println("User created successfully")
}

func main() {
	CreateUser("alice", "12345", 100000)
}