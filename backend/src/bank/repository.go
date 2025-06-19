package bank

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"     // Asumiendo la misma estructura de proyecto
	"github.com/V-enekoder/HiringGroup/src/schema" // Asumiendo que el schema de Bank está aquí
	"gorm.io/gorm"
)

// BankExistsByNameRepository verifica si un banco con el mismo nombre ya existe.
func BankExistsByNameRepository(name string) (bool, error) {
	var b schema.Bank
	db := config.DB
	err := db.Where("name = ?", name).First(&b).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil // No existe, no es un error
		}
		return false, err // Otro tipo de error
	}
	return true, nil // Existe
}

// CreateBankRepository crea un nuevo registro de banco en la base de datos.
func CreateBankRepository(b *schema.Bank) error {
	db := config.DB
	return db.Create(b).Error
}

// GetAllBanksRepository obtiene todos los bancos de la base de datos.
func GetAllBanksRepository() ([]schema.Bank, error) {
	var banks []schema.Bank
	db := config.DB
	// No usamos Preload("Candidates") aquí para no sobrecargar la respuesta por defecto.
	err := db.Find(&banks).Error
	return banks, err
}

// GetBankByIDRepository obtiene un banco por su ID.
func GetBankByIDRepository(id uint) (schema.Bank, error) {
	var b schema.Bank
	db := config.DB
	// No usamos Preload("Candidates") para la respuesta individual básica.
	err := db.First(&b, id).Error
	return b, err
}

// UpdateBankRepository actualiza los datos de un banco.
func UpdateBankRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.Bank{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Devuelve un error si no se encontró el registro para actualizar
	}
	return nil
}

// DeleteBankRepository elimina un banco de la base de datos.
func DeleteBankRepository(id uint) error {
	db := config.DB
	result := db.Delete(&schema.Bank{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Devuelve un error si no se encontró nada para eliminar
	}
	return nil
}
