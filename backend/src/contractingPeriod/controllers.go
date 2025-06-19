package contractingperiod

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreatePeriodController maneja la petición para crear un nuevo período de contratación.
func CreatePeriodController(c *gin.Context) {
	var dto ContractingPeriodCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreatePeriodService(dto)
	if err != nil {
		if errors.Is(err, ErrPeriodExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contracting period"})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllPeriodsController maneja la petición para obtener todos los períodos.
func GetAllPeriodsController(c *gin.Context) {
	periods, err := GetAllPeriodsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve contracting periods"})
		return
	}

	c.JSON(http.StatusOK, periods)
}

// GetPeriodByIDController maneja la petición para obtener un período por su ID.
func GetPeriodByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	period, err := GetPeriodByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Contracting period not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve contracting period"})
		return
	}

	c.JSON(http.StatusOK, period)
}

// UpdatePeriodController maneja la petición para actualizar un período.
func UpdatePeriodController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto ContractingPeriodUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedPeriod, err := UpdatePeriodService(uint(id), dto)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Contracting period not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contracting period"})
		return
	}

	c.JSON(http.StatusOK, updatedPeriod)
}

// DeletePeriodController maneja la petición para eliminar un período.
func DeletePeriodController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeletePeriodService(uint(id)); err != nil {
		if errors.Is(err, ErrPeriodHasContracts) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		// El servicio ya ignora gorm.ErrRecordNotFound, así que un error aquí es del servidor.
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contracting period"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contracting period deleted successfully"})
}
