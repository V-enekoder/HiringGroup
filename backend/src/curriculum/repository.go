package curriculum

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Funciones de validación
func CheckCandidateExists(id uint) error {
	var candidate schema.Candidate
	if err := config.DB.First(&candidate, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCandidateNotFound
		}
		return err
	}
	return nil
}

func CheckProfessionExists(id uint) error {
	var profession schema.Profession
	if err := config.DB.First(&profession, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrProfessionNotFound
		}
		return err
	}
	return nil
}

func CheckCandidateHasCurriculum(candidateID uint) error {
	var count int64
	config.DB.Model(&schema.Curriculum{}).Where("candidate_id = ?", candidateID).Count(&count)
	if count > 0 {
		return ErrCandidateHasCurriculum
	}
	return nil
}

// CreateCurriculumRepository crea un nuevo registro.
func CreateCurriculumRepository(cv *schema.Curriculum) error {
	return config.DB.Create(cv).Error
}

// GetAllCurriculumsRepository obtiene todos los currículums.
func GetAllCurriculumsRepository() ([]schema.Curriculum, error) {
	var cvs []schema.Curriculum
	// No precargamos todo aquí para mantener la consulta ligera. El servicio se encarga de enriquecer.
	err := config.DB.Find(&cvs).Error
	return cvs, err
}

// GetCurriculumByIDRepository obtiene un currículum con todas sus relaciones precargadas.
func GetCurriculumByIDRepository(id uint) (schema.Curriculum, error) {
	var cv schema.Curriculum
	err := config.DB.
		Preload("Candidate.User"). // Precargamos el Candidato y su Usuario anidado
		Preload("Profession").
		Preload("LaboralExperiences").
		First(&cv, id).Error
	return cv, err
}

func GetCurriculumByCandidateIDRepository(candidateID uint) (schema.Curriculum, error) {
	var cv schema.Curriculum
	err := config.DB.
		Preload("Candidate.User"). // Precargamos el Candidato y su Usuario anidado
		Preload("Profession").
		Preload("LaboralExperiences").
		Where("candidate_id = ?", candidateID).
		First(&cv).Error
	return cv, err
}

// UpdateCurriculumRepository actualiza un currículum.
func UpdateCurriculumRepository(id uint, data map[string]interface{}) error {
	result := config.DB.Model(&schema.Curriculum{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteCurriculumRepository elimina un currículum y sus experiencias laborales en una transacción.
func DeleteCurriculumRepository(id uint) error {
	return config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Eliminar todas las experiencias laborales asociadas.
		if err := tx.Where("curriculum_id = ?", id).Delete(&schema.LaboralExperience{}).Error; err != nil {
			return err
		}

		// 2. Eliminar el currículum.
		result := tx.Delete(&schema.Curriculum{}, id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound // Si el currículum no existía
		}

		return nil // Commit
	})
}
