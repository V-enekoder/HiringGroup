package postulation

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func PostulationExistsRepository(candidateID, jobID uint) (bool, error) {
	var p schema.Postulation
	db := config.DB
	err := db.Where("candidate_id = ? AND job_id = ?", candidateID, jobID).First(&p).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func CreatePostulationRepository(p *schema.Postulation) error {
	db := config.DB
	return db.Create(p).Error
}

func GetAllPostulationsRepository() ([]schema.Postulation, error) {
	var postulations []schema.Postulation
	db := config.DB
	err := db.Preload("Candidate.User").Preload("JobOffer.Company").Preload("Contract").Find(&postulations).Error
	return postulations, err
}

func GetPostulationByIDRepository(id uint) (schema.Postulation, error) {
	var p schema.Postulation
	db := config.DB
	err := db.Preload("Candidate.User").Preload("JobOffer.Company").Preload("Contract").First(&p, id).Error
	return p, err
}

func UpdatePostulationRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.Postulation{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func DeletePostulationRepository(id uint) error {
	db := config.DB
	return db.Delete(&schema.Postulation{}, id).Error
}
