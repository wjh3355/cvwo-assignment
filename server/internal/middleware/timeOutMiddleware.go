package middleware

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
)

// this middleware function terminates any request that takes more than `sec` seconds to complete
func TimeOutMiddleware(sec int) gin.HandlerFunc {
	return func(c *gin.Context) {

		ctx, cancel := context.WithTimeout(
			c.Request.Context(),
			time.Duration(sec)*time.Second,
		)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
