package voting

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/models"
)

type VoteRequest struct {
	PostOrCommentID int    `json:"postOrCommentId" binding:"required"`
	VoteType        int    `json:"voteType"`                         // 1 for upvote, -1 for downvote, 0 for removing vote
	PostOrComment   string `json:"postOrComment" binding:"required"` // either "post" or "comment"
}

func VoteOnPostOrComment(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		u, _ := c.Get("user")
		user := u.(models.User)

		var req VoteRequest
		if err := c.ShouldBindJSON(&req); err != nil || !(req.PostOrComment == "post" || req.PostOrComment == "comment") {
			fmt.Println("Invalid voting request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		var query string
		if req.PostOrComment == "post" {
			if req.VoteType == 0 {
				query = `DELETE FROM post_votes WHERE user_id = $1 AND post_id = $2;`
			} else {
				query = `
					INSERT INTO post_votes (user_id, post_id, vote_type)
					VALUES ($1, $2, $3)
					ON CONFLICT (user_id, post_id)
					DO UPDATE SET vote_type = EXCLUDED.vote_type;
				`
			}
		} else {
			if req.VoteType == 0 {
				query = `DELETE FROM comment_votes WHERE user_id = $1 AND comment_id = $2;`
			} else {
				query = `
					INSERT INTO comment_votes (user_id, comment_id, vote_type)
					VALUES ($1, $2, $3)
					ON CONFLICT (user_id, comment_id)
					DO UPDATE SET vote_type = EXCLUDED.vote_type;
				`
			}
		}

		var err error

		if req.VoteType == 0 {
			_, err = pool.Exec(c, query, user.ID, req.PostOrCommentID)
		} else {
			_, err = pool.Exec(c, query, user.ID, req.PostOrCommentID, req.VoteType)
		}

		if err != nil {
			fmt.Println("Error updating vote:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vote"})
			c.Abort()
			return
		}

		fmt.Println("Vote for", req.PostOrComment, "ID", req.PostOrCommentID, "by user ID", user.ID, "updated successfully: ", req.VoteType)

		c.JSON(http.StatusOK, gin.H{"message": "Vote updated successfully"})

	}
}
