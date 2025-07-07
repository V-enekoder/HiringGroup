package jobOffer

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateJobOfferController(c *gin.Context) {
	var dto JobOfferCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateJobOfferService(dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}
func GetAllActiveJobOffersController(c *gin.Context) {
	jobOffers, err := GetAllActiveJobOffersService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, jobOffers)
}

func GetActiveJobOffersController(c *gin.Context) {
	jobOffers, err := GetAllJobOffersService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var activeJobOffers []JobOfferResponseDTO
	for _, offer := range jobOffers {
		if offer.Active {
			activeJobOffers = append(activeJobOffers, offer)
		}
	}

	c.JSON(http.StatusOK, activeJobOffers)
}

func GetJobOfferByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	jobOffer, err := GetJobOfferByIDService(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job offer not found"})
		return
	}

	c.JSON(http.StatusOK, jobOffer)
}

func UpdateJobOfferController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto JobOfferUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedJobOffer, err := UpdateJobOfferService(uint(id), dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedJobOffer)
}

func DeleteJobOfferController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteJobOfferService(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job offer deleted successfully"})
}
