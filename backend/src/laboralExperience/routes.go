package laboralexperience

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de laboral_experience en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	experiences := router.Group("/laboral-experiences")
	{
		experiences.POST("/", CreateExperienceController)
		experiences.GET("/", GetAllExperiencesController)
		experiences.GET("/:id", GetExperienceByIDController)
		experiences.PUT("/:id", UpdateExperienceController)
		experiences.DELETE("/:id", DeleteExperienceController)
	}
}
