package contractingperiod

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// PeriodExistsByNameRepository verifica si un período con el mismo nombre ya existe.
func PeriodExistsByNameRepository(name string) (bool, error) {
	var p schema.ContractingPeriod
	db := config.DB
	err := db.Where("name = ?", name).First(&p).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// CreatePeriodRepository crea un nuevo registro en la base de datos.
func CreatePeriodRepository(p *schema.ContractingPeriod) error {
	db := config.DB
	return db.Create(p).Error
}

// GetAllPeriodsRepository obtiene todos los períodos de la base de datos.
func GetAllPeriodsRepository() ([]schema.ContractingPeriod, error) {
	var periods []schema.ContractingPeriod
	db := config.DB
	err := db.Find(&periods).Error
	return periods, err
}

// GetPeriodByIDRepository obtiene un período por su ID.
func GetPeriodByIDRepository(id uint) (schema.ContractingPeriod, error) {
	var p schema.ContractingPeriod
	db := config.DB
	err := db.First(&p, id).Error
	return p, err
}

// UpdatePeriodRepository actualiza los datos de un período.
func UpdatePeriodRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.ContractingPeriod{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeletePeriodRepository elimina un período de la base de datos.
// Primero verifica que no tenga contratos asociados.
func DeletePeriodRepository(id uint) error {
	db := config.DB

	// 1. Verificar si existen contratos asociados a este período.
	var count int64
	db.Model(&schema.Contract{}).Where("period_id = ?", id).Count(&count)
	if count > 0 {
		return ErrPeriodHasContracts // Error personalizado definido en el servicio
	}

	// 2. Si no hay contratos, proceder con la eliminación.
	result := db.Delete(&schema.ContractingPeriod{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
