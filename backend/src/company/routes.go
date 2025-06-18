package company

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de company en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	companies := router.Group("/companies")
	{
		companies.POST("/", CreateCompanyController)
		companies.GET("/", GetAllCompaniesController)
		companies.GET("/:id", GetCompanyByIDController)
		companies.PUT("/:id", UpdateCompanyController)
		companies.DELETE("/:id", DeleteCompanyController)
	}
}
