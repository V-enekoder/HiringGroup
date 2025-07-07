package emergencycontact

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateContactController maneja la creación de un nuevo contacto de emergencia.
func CreateContactController(c *gin.Context) {
	var dto EmergencyContactCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateContactService(dto)
	if err != nil {
		if errors.Is(err, ErrDocumentExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		log.Printf("Error desde el servicio: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create emergency contact"})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllContactsController maneja la obtención de todos los contactos.
func GetAllContactsController(c *gin.Context) {
	contacts, err := GetAllContactsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve emergency contacts"})
		return
	}
	c.JSON(http.StatusOK, contacts)
}

// GetContactByIDController maneja la obtención de un contacto por ID.
func GetContactByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	contact, err := GetContactByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Emergency contact not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve emergency contact"})
		return
	}
	c.JSON(http.StatusOK, contact)
}

// UpdateContactController maneja la actualización de un contacto.
func UpdateContactController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto EmergencyContactUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedContact, err := UpdateContactService(uint(id), dto)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Emergency contact not found"})
			return
		}
		if errors.Is(err, ErrDocumentExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update emergency contact"})
		return
	}
	c.JSON(http.StatusOK, updatedContact)
}

// DeleteContactController maneja la eliminación de un contacto.
func DeleteContactController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteContactService(uint(id)); err != nil {
		if errors.Is(err, ErrContactInUse) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete emergency contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Emergency contact deleted successfully"})
}
