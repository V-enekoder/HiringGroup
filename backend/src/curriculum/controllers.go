package curriculum

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateCurriculumController maneja la creación de un currículum.
func CreateCurriculumController(c *gin.Context) {
	var dto CurriculumCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateCurriculumService(dto)
	if err != nil {
		switch {
		case errors.Is(err, ErrCandidateNotFound), errors.Is(err, ErrProfessionNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, ErrCandidateHasCurriculum):
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create curriculum"})
		}
		return
	}
	c.JSON(http.StatusCreated, response)
}

// GetAllCurriculumsController obtiene todos los currículums.
func GetAllCurriculumsController(c *gin.Context) {
	cvs, err := GetAllCurriculumsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve curriculums"})
		return
	}
	c.JSON(http.StatusOK, cvs)
}

// GetCurriculumByIDController obtiene un currículum por su ID.
func GetCurriculumByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	cv, err := GetCurriculumByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Curriculum not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve curriculum"})
		return
	}
	c.JSON(http.StatusOK, cv)
}

// UpdateCurriculumController actualiza un currículum.
func UpdateCurriculumController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto CurriculumUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedCV, err := UpdateCurriculumService(uint(id), dto)
	if err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Curriculum not found"})
		case errors.Is(err, ErrProfessionNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update curriculum"})
		}
		return
	}
	c.JSON(http.StatusOK, updatedCV)
}

// DeleteCurriculumController elimina un currículum.
func DeleteCurriculumController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteCurriculumService(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete curriculum"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Curriculum deleted successfully"})
}
