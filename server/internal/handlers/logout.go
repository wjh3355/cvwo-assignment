package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)


type LogoutResponse struct {
	Success bool `json:"success"`
}

func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.SetCookie(
			"forum_token",          		// cookie name
			"",             				   // value
			-1,                   			// max age (seconds) - set to expire the cookie
			"/",                     		// path
			"",                      		// domain (empty = current)
			gin.Mode() == gin.ReleaseMode,// secure (true in production HTTPS)
			true,                    		// httpOnly
		)
		
		c.JSON(http.StatusOK, LogoutResponse{
			Success: true,
		})
	}
}