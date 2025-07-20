package payment

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de payment en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	payments := router.Group("/payments")
	{
		payments.POST("/", CreatePaymentController)
		payments.GET("/", GetAllPaymentsController)
		payments.GET("/:id", GetPaymentByIDController)
		payments.GET("/company/:companyId", GetPaymentsByCompanyIDController)

	}
}
