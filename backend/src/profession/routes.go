package profession

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de profession en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	professions := router.Group("/professions")
	{
		professions.POST("/", CreateProfessionController)
		professions.GET("/", GetAllProfessionsController)
		professions.GET("/:id", GetProfessionByIDController)
		professions.PUT("/:id", UpdateProfessionController)
		professions.DELETE("/:id", DeleteProfessionController)
	}
}
