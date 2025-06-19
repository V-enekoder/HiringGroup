package contractingperiod

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de contracting_period en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	periods := router.Group("/contracting-periods")
	{
		periods.POST("/", CreatePeriodController)
		periods.GET("/", GetAllPeriodsController)
		periods.GET("/:id", GetPeriodByIDController)
		periods.PUT("/:id", UpdatePeriodController)
		periods.DELETE("/:id", DeletePeriodController)
	}
}
