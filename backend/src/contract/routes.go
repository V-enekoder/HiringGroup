package contract

import "github.com/gin-gonic/gin"

func RegisterRoutes(router *gin.Engine) {
	contracts := router.Group("/contracts")
	{
		contracts.POST("/", CreateContractController)
		contracts.GET("/", GetAllContractsController)
		contracts.GET("/:id", GetContractByIDController)
		contracts.PUT("/:id", UpdateContractController)
		contracts.GET("/:id/payment-summary", GetPaymentSummaryController)
	}
}
