package comments

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
)

type VoteRequest struct {
	CommentID   int  `json:"commentId" binding:"required"`
	VoteType int  `json:"voteType"` // 1 for upvote, -1 for downvote, 0 for removing vote
}

func VoteOnComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		u, _ := c.Get("user")
		currUserIfAny := u.(models.User)

		var req VoteRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			fmt.Println("Invalid comment voting request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		var err error

		if req.VoteType == 0 {
			_, err = pool.Exec(
				c.Request.Context(),
				`
					DELETE FROM comment_votes cv
						WHERE cv.user_id = $1 AND cv.comment_id = $2;
				`,
				currUserIfAny.ID,
				req.CommentID,
			)
		} else {
			_, err = pool.Exec(
				c.Request.Context(),
				`
					INSERT INTO comment_votes (user_id, comment_id, vote_type)
						VALUES ($1, $2, $3)
						ON CONFLICT (user_id, comment_id)
						DO UPDATE SET vote_type = EXCLUDED.vote_type;
				`,
				currUserIfAny.ID,
				req.CommentID,
				req.VoteType,
			)
		}

		if err != nil {
			fmt.Println("Error updating comment vote:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment vote"})
			c.Abort()
			return
		}

		fmt.Println("Comment vote for comment ID", req.CommentID, "by user ID", currUserIfAny.ID, "updated successfully: ", req.VoteType)

		c.JSON(http.StatusOK, gin.H{"message": "Vote updated successfully"})

	}
}
