package jobOffer

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de joboffer en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	joboffers := router.Group("/joboffers")
	{
		joboffers.POST("/", CreateJobOfferController)
		joboffers.GET("/", GetAllActiveJobOffersController)
		joboffers.GET("/active", GetActiveJobOffersController)
		joboffers.GET("/:id", GetJobOfferByIDController)
		joboffers.GET("/company/:companyId", GetJobOffersByCompanyController)
		joboffers.PUT("/:id", UpdateJobOfferController)
		joboffers.DELETE("/:id", DeleteJobOfferController)
	}
}
