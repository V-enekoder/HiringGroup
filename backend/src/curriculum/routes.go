package curriculum

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de curriculum en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	cvs := router.Group("/curriculums")
	{
		cvs.POST("/", CreateCurriculumController)
		cvs.GET("/", GetAllCurriculumsController)
		cvs.GET("/:id", GetCurriculumByIDController)
		cvs.PUT("/:id", UpdateCurriculumController)
		cvs.DELETE("/:id", DeleteCurriculumController)
	}
}
