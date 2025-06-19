package profession

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// ProfessionExistsByNameRepository verifica si una profesión con el mismo nombre ya existe.
func ProfessionExistsByNameRepository(name string) (bool, error) {
	var p schema.Profession
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

// CreateProfessionRepository crea un nuevo registro de profesión.
func CreateProfessionRepository(p *schema.Profession) error {
	db := config.DB
	return db.Create(p).Error
}

// GetAllProfessionsRepository obtiene todas las profesiones.
func GetAllProfessionsRepository() ([]schema.Profession, error) {
	var professions []schema.Profession
	db := config.DB
	err := db.Find(&professions).Error
	return professions, err
}

// GetProfessionByIDRepository obtiene una profesión por su ID.
func GetProfessionByIDRepository(id uint) (schema.Profession, error) {
	var p schema.Profession
	db := config.DB
	err := db.First(&p, id).Error
	return p, err
}

// UpdateProfessionRepository actualiza los datos de una profesión.
func UpdateProfessionRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.Profession{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteProfessionRepository elimina una profesión, verificando primero si está en uso.
func DeleteProfessionRepository(id uint) error {
	db := config.DB

	// Usamos una transacción para asegurar la atomicidad de las comprobaciones y la eliminación.
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar si la profesión está en uso en Curriculums.
		var curriculumCount int64
		if err := tx.Model(&schema.Curriculum{}).Where("profession_id = ?", id).Count(&curriculumCount).Error; err != nil {
			return err
		}
		if curriculumCount > 0 {
			return ErrProfessionInUse // Error personalizado del servicio
		}

		// 2. Verificar si la profesión está en uso en JobOffers.
		var jobOfferCount int64
		if err := tx.Model(&schema.JobOffer{}).Where("profession_id = ?", id).Count(&jobOfferCount).Error; err != nil {
			return err
		}
		if jobOfferCount > 0 {
			return ErrProfessionInUse // Error personalizado del servicio
		}

		// 3. Si no está en uso, proceder con la eliminación.
		result := tx.Delete(&schema.Profession{}, id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil // Commit de la transacción
	})
}
