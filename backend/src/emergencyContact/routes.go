package emergencycontact

import "github.com/gin-gonic/gin"

// RegisterRoutes registra los endpoints de emergency_contact en el router de Gin.
func RegisterRoutes(router *gin.Engine) {
	contacts := router.Group("/emergency-contacts")
	{
		contacts.POST("/", CreateContactController)
		contacts.GET("/", GetAllContactsController)
		contacts.GET("/:id", GetContactByCandidateIDController)
		contacts.PUT("/:id", UpdateContactController)
		contacts.DELETE("/:id", DeleteContactController)
	}
}
