package candidate

import "github.com/gin-gonic/gin"

func RegisterRoutes(router *gin.Engine) {

	candidates := router.Group("/candidates")
	{
		candidates.POST("/", CreateCandidateController)
		candidates.GET("/", GetAllCandidatesController)
		candidates.GET("/:id", GetCandidateByIDController)
		candidates.PUT("/:id", UpdateCandidateController)
		candidates.DELETE("/:id", DeleteCandidateController)
	}
}
