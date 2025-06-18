package payment

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreatePaymentController maneja la petición para crear y calcular un pago.
func CreatePaymentController(c *gin.Context) {
	var dto PaymentCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreatePaymentService(dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllPaymentsController maneja la petición para obtener todos los pagos.
func GetAllPaymentsController(c *gin.Context) {
	payments, err := GetAllPaymentsService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payments)
}

// GetPaymentByIDController maneja la petición para obtener un pago por ID.
func GetPaymentByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	payment, err := GetPaymentByIDService(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, payment)
}
