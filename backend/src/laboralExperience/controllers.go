package laboralexperience

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateExperienceController maneja la creación de una experiencia laboral.
func CreateExperienceController(c *gin.Context) {
	var dto LaboralExperienceCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateExperienceService(dto)
	if err != nil {
		switch {
		case errors.Is(err, ErrCurriculumNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, ErrInvalidDateFormat), errors.Is(err, ErrInvalidDateRange):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create laboral experience"})
		}
		return
	}
	c.JSON(http.StatusCreated, response)
}

// GetAllExperiencesController obtiene todas las experiencias.
func GetAllExperiencesController(c *gin.Context) {
	experiences, err := GetAllExperiencesService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve laboral experiences"})
		return
	}
	c.JSON(http.StatusOK, experiences)
}

// GetExperienceByIDController obtiene una experiencia por su ID.
func GetExperienceByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	experience, err := GetExperienceByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Laboral experience not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve laboral experience"})
		return
	}
	c.JSON(http.StatusOK, experience)
}

// UpdateExperienceController actualiza una experiencia laboral.
func UpdateExperienceController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto LaboralExperienceUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedExp, err := UpdateExperienceService(uint(id), dto)
	if err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Laboral experience not found"})
		case errors.Is(err, ErrInvalidDateFormat), errors.Is(err, ErrInvalidDateRange):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update laboral experience"})
		}
		return
	}
	c.JSON(http.StatusOK, updatedExp)
}

// DeleteExperienceController elimina una experiencia laboral.
func DeleteExperienceController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteExperienceService(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete laboral experience"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Laboral experience deleted successfully"})
}
