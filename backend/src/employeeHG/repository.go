package employeehg

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// UserEmailExistsRepository verifica si un email ya existe en la tabla de usuarios.
// Esta función podría estar en un paquete `user/repository` para reutilización.
func UserEmailExistsRepository(email string) (bool, error) {
	var user schema.User
	db := config.DB
	err := db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// CreateEmployeeHGRepository crea un User y un EmployeeHG en una transacción.
func CreateEmployeeHGRepository(user *schema.User) (schema.EmployeeHG, error) {
	var employee schema.EmployeeHG
	db := config.DB

	err := db.Transaction(func(tx *gorm.DB) error {
		// 1. Crear el usuario
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		// 2. Crear el registro de EmployeeHG asociado
		employee.UserID = user.ID
		if err := tx.Create(&employee).Error; err != nil {
			return err
		}

		return nil // Commit
	})

	if err != nil {
		return schema.EmployeeHG{}, err
	}

	if err := db.Preload("User.Role").First(&employee, employee.ID).Error; err != nil {
		// Este error sería muy raro (no encontrar un registro que acabas de crear), pero es bueno manejarlo.
		return schema.EmployeeHG{}, err
	}

	return employee, nil
}

// GetAllEmployeesHGRepository obtiene todos los empleados, precargando sus datos de usuario.
func GetAllEmployeesHGRepository() ([]schema.EmployeeHG, error) {
	var employees []schema.EmployeeHG
	db := config.DB
	err := db.Preload("User.Role").Find(&employees).Error
	return employees, err
}

// GetEmployeeHGByIDRepository obtiene un empleado por su ID, con datos de usuario.
func GetEmployeeHGByIDRepository(id uint) (schema.EmployeeHG, error) {
	var employee schema.EmployeeHG
	db := config.DB
	err := db.Preload("User.Role").First(&employee, id).Error
	return employee, err
}

// UpdateEmployeeHGRepository actualiza datos en la tabla User asociada.
func UpdateEmployeeHGRepository(id uint, data map[string]interface{}) error {
	db := config.DB

	// Primero, encontrar el empleado para obtener su UserID.
	var employee schema.EmployeeHG
	if err := db.First(&employee, id).Error; err != nil {
		return err // Devuelve gorm.ErrRecordNotFound si no existe
	}

	// Actualizar la tabla User.
	result := db.Model(&schema.User{}).Where("id = ?", employee.UserID).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		// Esto no debería pasar si el First anterior funcionó, pero es una buena práctica.
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteEmployeeHGRepository elimina el EmployeeHG y el User asociado en una transacción.
func DeleteEmployeeHGRepository(id uint) error {
	db := config.DB
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Encontrar el empleado para obtener su UserID.
		var employee schema.EmployeeHG
		if err := tx.First(&employee, id).Error; err != nil {
			// Si no se encuentra, podría considerarse un éxito (ya está borrado).
			// GORM maneja esto, devolviendo gorm.ErrRecordNotFound que se puede ignorar en el servicio.
			return err
		}

		// 2. Eliminar el registro de EmployeeHG.
		if err := tx.Delete(&schema.EmployeeHG{}, id).Error; err != nil {
			return err
		}

		// 3. Eliminar el usuario asociado.
		if err := tx.Delete(&schema.User{}, employee.UserID).Error; err != nil {
			return err
		}

		return nil // Commit
	})
}
