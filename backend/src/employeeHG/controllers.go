package employeehg

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateEmployeeHGController maneja la petición para crear un nuevo Empleado de HG.
// Esto crea tanto un User como un EmployeeHG.
func CreateEmployeeHGController(c *gin.Context) {
	var dto EmployeeHGCreateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := CreateEmployeeHGService(dto)
	if err != nil {
		if errors.Is(err, ErrUserEmailExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee"})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllEmployeesHGController maneja la petición para obtener todos los empleados de HG.
func GetAllEmployeesHGController(c *gin.Context) {
	employees, err := GetAllEmployeesHGService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve employees"})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// GetEmployeeHGByIDController maneja la petición para obtener un empleado por su ID.
func GetEmployeeHGByIDController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	employee, err := GetEmployeeHGByIDService(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve employee"})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// UpdateEmployeeHGController maneja la petición para actualizar los datos de un empleado.
// Actualiza los campos Name y RoleID en el registro de User asociado.
func UpdateEmployeeHGController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dto EmployeeHGUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedEmployee, err := UpdateEmployeeHGService(uint(id), dto)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	c.JSON(http.StatusOK, updatedEmployee)
}

// DeleteEmployeeHGController maneja la petición para eliminar un empleado.
// Esto elimina tanto el registro de EmployeeHG como el de User asociado.
func DeleteEmployeeHGController(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := DeleteEmployeeHGService(uint(id)); err != nil {
		// El servicio ya maneja el caso 'not found', por lo que cualquier error aquí es del servidor.
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee HG deleted successfully"})
}
