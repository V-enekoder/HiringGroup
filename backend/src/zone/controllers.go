package zone

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateZoneController maneja la solicitud para crear una zona.
func CreateZoneController(c *gin.Context) {
	var dto ZoneCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	zoneResponse, err := CreateZoneService(dto)
	if err != nil {
		if err.Error() == "zone with this name already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, zoneResponse)
}

// GetAllZonesController maneja la solicitud para obtener todas las zonas.
func GetAllZonesController(c *gin.Context) {
	zones, err := GetAllZonesService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, zones)
}

// GetZoneByIdController maneja la solicitud para obtener una zona por su ID.
func GetZoneByIdController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid zone ID"})
		return
	}

	zone, err := GetZoneByIdService(uint(id))
	if err != nil {
		// El servicio devuelve un error específico si no se encuentra
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, zone)
}

// UpdateZoneController maneja la solicitud para actualizar una zona.
func UpdateZoneController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid zone ID"})
		return
	}

	var dto ZoneUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedZone, err := UpdateZoneService(uint(id), dto)
	if err != nil {
		if err.Error() == "zone with this name already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		// Podría ser un error 404 si la zona a actualizar no existe
		if err.Error() == "zone with id "+c.Param("id")+" not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedZone)
}

// DeleteZoneController maneja la solicitud para eliminar una zona.
func DeleteZoneController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid zone ID"})
		return
	}

	if err := DeleteZoneService(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Zone deleted successfully"})
}
