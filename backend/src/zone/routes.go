package zone

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	// Crea un grupo de rutas bajo el prefijo "/zone"
	zones := router.Group("/zones")
	{
		zones.POST("/", CreateZoneController)
		zones.GET("/", GetAllZonesController)
		zones.GET("/:id", GetZoneByIdController)
		zones.PUT("/:id", UpdateZoneController)
		zones.DELETE("/:id", DeleteZoneController)
	}
}
