package user

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- CONTROLADOR DE REGISTRO (REEMPLAZA A CreateUserController) ---
func RegisterController(c *gin.Context) {
	var dto RegisterRequestDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := RegisterUserService(dto)
	if err != nil {
		// Manejar error de email duplicado
		if err.Error() == "Correo ya registrado" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		// Manejar errores de validación de campos del perfil
		if strings.Contains(err.Error(), "required for") || strings.Contains(err.Error(), "invalid or unsupported role") {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Otros errores
		status, message := handleExceptions(err)
		c.JSON(status, gin.H{"error": message})
		return
	}

	var loginDTO LoginRequestDTO
	loginDTO.Email = dto.Email
	loginDTO.Password = dto.Password

	response, err := LoginUserService(loginDTO)
	if err != nil {
		if err.Error() == "credenciales inválidas" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		log.Printf("Internal login error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "An internal error occurred"})
		return
	}

	c.JSON(http.StatusOK, response)
	//c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// --- NUEVO CONTROLADOR DE LOGIN ---
func LoginController(c *gin.Context) {
	var dto LoginRequestDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := LoginUserService(dto)
	if err != nil {
		if err.Error() == "credenciales inválidas" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		log.Printf("Internal login error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "An internal error occurred"})
		return
	}

	c.JSON(http.StatusOK, response)
}

func CreateUserController(c *gin.Context) {
	var userDTO UserCreateDTO
	if err := c.ShouldBind(&userDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := CreateUserService(userDTO)
	if err != nil {
		status, errorMessage := handleExceptions(err)
		c.JSON(status, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": id,
	})

}

func handleExceptions(err error) (int, string) {
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		return http.StatusNotFound, "Usuario no Encontrado"
	default:
		return http.StatusInternalServerError, err.Error()
	}
}

func GetUserByIdController(c *gin.Context) {
	id := c.Param("id")
	userId, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	user, err := GetUserByIdService(uint(userId))
	if err != nil {
		status, errorMessage := handleExceptions(err)
		c.JSON(status, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}

func UpdatePasswordUserController(c *gin.Context) {
	id := c.Param("id")
	userId, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var passwordDTO UserUpdatePasswordDTO
	if err := c.ShouldBindJSON(&passwordDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := UpdatePasswordUserService(uint(userId), passwordDTO); err != nil {
		status, errorMessage := handleExceptions(err)
		c.JSON(status, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Password updated successfully",
	})
}

func UpdateUserController(c *gin.Context) {
	id := c.Param("id")
	userId, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var userDTO UserUpdateDTO
	if err := c.ShouldBind(&userDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := UpdateUserService(uint(userId), userDTO); err != nil {
		status, errorMessage := handleExceptions(err)
		c.JSON(status, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
	})
}

func DeleteUserbyIdController(c *gin.Context) {
	id := c.Param("id")
	revId, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = DeleteUserByIdService(uint(revId))
	if err != nil {
		status, errorMessage := handleExceptions(err)
		c.JSON(status, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Usuario eliminado Exitosamente",
	})
}
