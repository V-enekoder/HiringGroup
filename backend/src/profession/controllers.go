package profession

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateProfessionController maneja la petición para crear una nueva profesión.
func CreateProfessionController(c *gin.Context) {
	var dto ProfessionCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateProfessionService(dto)
	if err != nil {
		if errors.Is(err, ErrProfessionExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create profession"})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllProfessionsController maneja la petición para obtener todas las profesiones.
func GetAllProfessionsController(c *gin.Context) {
	professions, err := GetAllProfessionsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve professions"})
		return
	}

	c.JSON(http.StatusOK, professions)
}

// GetProfessionByIDController maneja la petición para obtener una profesión por su ID.
func GetProfessionByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	profession, err := GetProfessionByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profession not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profession"})
		return
	}

	c.JSON(http.StatusOK, profession)
}

// UpdateProfessionController maneja la petición para actualizar una profesión.
func UpdateProfessionController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto ProfessionUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProfession, err := UpdateProfessionService(uint(id), dto)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profession not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profession"})
		return
	}

	c.JSON(http.StatusOK, updatedProfession)
}

// DeleteProfessionController maneja la petición para eliminar una profesión.
func DeleteProfessionController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteProfessionService(uint(id)); err != nil {
		if errors.Is(err, ErrProfessionInUse) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete profession"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profession deleted successfully"})
}
