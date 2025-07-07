package candidate

import (
	"github.com/V-enekoder/HiringGroup/config" // Asumiendo que aquí está la conexión DB
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func CreateCandidateRepository(user *schema.User, candidateData *schema.Candidate) (schema.Candidate, error) {
	db := config.DB
	var createdCandidate schema.Candidate

	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		candidateData.UserID = user.ID
		if err := tx.Create(candidateData).Error; err != nil {
			return err
		}

		if err := tx.Preload("User.Role").First(&createdCandidate, candidateData.ID).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return schema.Candidate{}, err
	}

	return createdCandidate, nil
}

/*func CreateCandidateRepository(tx *gorm.DB, user *schema.User, candidate *schema.Candidate) error {
	db := config.DB
	if err := tx.Create(user).Error; err != nil {
		return err
	}

	candidate.UserID = user.ID
	if err := tx.Create(candidate).Error; err != nil {
		return err
	}
	_ = db.Preload("User.Role").Find(&candidate).Error

	return nil
}*/

func GetAllCandidatesRepository() ([]schema.Candidate, error) {
	var candidates []schema.Candidate
	db := config.DB

	// Precargamos User y el Rol del usuario para tener toda la info en una query
	err := db.Preload("User.Role").Find(&candidates).Error
	return candidates, err
}

func GetCandidateByIDRepository(id uint) (schema.Candidate, error) {
	var candidate schema.Candidate
	db := config.DB

	err := db.Preload("User.Role").First(&candidate, id).Error
	return candidate, err
}

func UpdateCandidateRepository(tx *gorm.DB, candidateToUpdate *schema.Candidate, userToUpdate *schema.User) error {
	if err := tx.Model(&schema.User{}).Where("id = ?", userToUpdate.ID).Updates(userToUpdate).Error; err != nil {
		return err
	}

	if err := tx.Model(&schema.Candidate{}).Where("id = ?", candidateToUpdate.ID).Updates(candidateToUpdate).Error; err != nil {
		return err
	}

	return nil
}

func DeleteCandidateRepository(tx *gorm.DB, candidateID, userID uint) error {

	if err := tx.Delete(&schema.Candidate{}, candidateID).Error; err != nil {
		return err
	}

	if err := tx.Delete(&schema.User{}, userID).Error; err != nil {
		return err
	}

	return nil
}
