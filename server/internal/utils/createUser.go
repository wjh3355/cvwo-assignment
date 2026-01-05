package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func CreateUser(password string) {

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	fmt.Println("Password hash:", string(hash))
}
