package employeehg

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de employee_hg en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	// Usamos un nombre de ruta descriptivo como "employees-hg"
	employees := router.Group("/employees-hg")
	{
		employees.POST("/", CreateEmployeeHGController)
		employees.GET("/", GetAllEmployeesHGController)
		employees.GET("/:id", GetEmployeeHGByIDController)
		employees.PUT("/:id", UpdateEmployeeHGController)
		employees.DELETE("/:id", DeleteEmployeeHGController)
	}
}
