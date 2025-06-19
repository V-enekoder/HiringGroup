package laboralexperience

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// CheckCurriculumExistsRepository verifica si un currículum con el ID dado existe.
func CheckCurriculumExistsRepository(id uint) error {
	var curriculum schema.Curriculum
	if err := config.DB.First(&curriculum, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCurriculumNotFound
		}
		return err
	}
	return nil
}

// CreateExperienceRepository crea un nuevo registro de experiencia laboral.
func CreateExperienceRepository(le *schema.LaboralExperience) error {
	return config.DB.Create(le).Error
}

// GetAllExperiencesRepository obtiene todas las experiencias laborales.
func GetAllExperiencesRepository() ([]schema.LaboralExperience, error) {
	var experiences []schema.LaboralExperience
	err := config.DB.Find(&experiences).Error
	return experiences, err
}

// GetExperienceByIDRepository obtiene una experiencia por su ID.
func GetExperienceByIDRepository(id uint) (schema.LaboralExperience, error) {
	var le schema.LaboralExperience
	err := config.DB.First(&le, id).Error
	return le, err
}

// UpdateExperienceRepository actualiza los datos de una experiencia.
func UpdateExperienceRepository(id uint, data map[string]interface{}) error {
	result := config.DB.Model(&schema.LaboralExperience{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteExperienceRepository elimina una experiencia de la base de datos.
func DeleteExperienceRepository(id uint) error {
	result := config.DB.Delete(&schema.LaboralExperience{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
