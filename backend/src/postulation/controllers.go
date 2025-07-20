package postulation

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreatePostulationController(c *gin.Context) {
	var dto PostulationCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreatePostulationService(dto)
	if err != nil {
		if errors.Is(err, ErrPostulationExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

func GetAllPostulationsController(c *gin.Context) {
	postulations, err := GetAllPostulationsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, postulations)
}

func GetPostulationByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	postulation, err := GetPostulationByIDService(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postulation not found"})
		return
	}

	c.JSON(http.StatusOK, postulation)
}

func GetPostulationByJobOfferController(c *gin.Context) {
	jobOfferID, err := strconv.ParseUint(c.Param("jobOfferId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Job offer ID format"})
		return
	}

	postulations, err := GetPostulationByJobOfferService(uint(jobOfferID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, postulations)
}

func GetPostulationByCandidateIDController(c *gin.Context) {
	candidateID, err := strconv.ParseUint(c.Param("candidateId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Candidate ID format"})
		return
	}

	postulations, err := GetPostulationByCandidateService(uint(candidateID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, postulations)
}

func UpdatePostulationController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto PostulationUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedPostulation, err := UpdatePostulationService(uint(id), dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedPostulation)
}

func DeletePostulationController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeletePostulationService(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Postulation deleted successfully"})
}
