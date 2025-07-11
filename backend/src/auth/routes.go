package auth

import "github.com/gin-gonic/gin"

// SetupAuthRoutes configura las rutas de autenticación.
func SetupAuthRoutes(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", RegisterController)
		auth.POST("/login", LoginController)
	}
}
