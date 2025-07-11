package auth

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// RegisterController maneja la petición POST para registrar un usuario.
func RegisterController(c *gin.Context) {
	var dto RegisterRequestDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := RegisterUserService(dto)
	if err != nil {
		// Si el email ya existe, devolvemos un 409 Conflict.
		if strings.Contains(err.Error(), "email already in use") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		// Para otros errores de validación del servicio.
		if strings.Contains(err.Error(), "required for") || strings.Contains(err.Error(), "invalid or unsupported role") {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		log.Printf("Error during registration: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// LoginController maneja la petición POST para iniciar sesión.
func LoginController(c *gin.Context) {
	var dto LoginRequestDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := LoginUserService(dto)
	if err != nil {
		// Si las credenciales son inválidas, devolvemos 401 Unauthorized.
		if strings.Contains(err.Error(), "invalid credentials") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		log.Printf("Error during login: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "An internal error occurred"})
		return
	}

	c.JSON(http.StatusOK, response)
}
