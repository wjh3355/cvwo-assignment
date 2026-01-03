package db

import (
	"context"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgresPool() (*pgxpool.Pool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	connStr := os.Getenv("DATABASE_URL")
	return pgxpool.New(ctx, connStr)
}
