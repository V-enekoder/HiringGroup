package bank

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de bank en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	banks := router.Group("/banks")
	{
		banks.POST("/", CreateBankController)
		banks.GET("/", GetAllBanksController)
		banks.GET("/:id", GetBankByIDController)
		banks.PUT("/:id", UpdateBankController)
		banks.DELETE("/:id", DeleteBankController)
	}
}
