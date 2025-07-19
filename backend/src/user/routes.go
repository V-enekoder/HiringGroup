package user

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	users := router.Group("/users")
	{
		users.POST("/", CreateUserController)

		users.GET("/id/:id", GetUserByIdController)

		users.PUT("/:id", UpdateUserController)
		users.PUT("/password/:id", UpdatePasswordUserController)

		users.DELETE("/:id", DeleteUserbyIdController)

		// --- NUEVAS RUTAS DE AUTENTICACIÓN ---
		users.POST("/register", RegisterController)
		users.POST("/login", LoginController)
	}
}
