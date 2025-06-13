package role

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {

	roles := router.Group("/roles")
	{
		roles.POST("/", CreateRoleController)
		roles.GET("/", GetAllRolesController)
		roles.GET("/:id", GetRoleByIdController)
		roles.PUT("/:id", UpdateRoleController)
		roles.DELETE("/:id", DeleteRoleController)
	}
}
