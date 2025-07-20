package postulation

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de postulation en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	postulations := router.Group("/postulations")
	{
		postulations.POST("/", CreatePostulationController)
		postulations.GET("/", GetAllPostulationsController)
		postulations.GET("/:id", GetPostulationByIDController)
		postulations.GET("/candidate/:candidateId", GetPostulationByCandidateIDController)
		postulations.GET("/joboffer/:jobOfferId", GetPostulationByJobOfferController)
		postulations.PUT("/:id", UpdatePostulationController)
		postulations.DELETE("/:id", DeletePostulationController)
	}
}
