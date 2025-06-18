package company

import (
	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func CreateCompanyRepository(tx *gorm.DB, user *schema.User, company *schema.Company) error {
	if err := tx.Create(user).Error; err != nil {
		return err
	}

	company.UserID = user.ID
	if err := tx.Create(company).Error; err != nil {
		return err
	}

	return nil
}

func GetAllCompaniesRepository() ([]schema.Company, error) {
	var companies []schema.Company
	db := config.DB

	err := db.Preload("User.Role").Find(&companies).Error
	return companies, err
}

func GetCompanyByIDRepository(id uint) (schema.Company, error) {
	var company schema.Company
	db := config.DB

	err := db.Preload("User.Role").First(&company, id).Error
	return company, err
}

func UpdateCompanyRepository(tx *gorm.DB, companyToUpdate *schema.Company, userToUpdate *schema.User) error {
	if userToUpdate.Name != "" {
		if err := tx.Model(&schema.User{}).Where("id = ?", userToUpdate.ID).Updates(userToUpdate).Error; err != nil {
			return err
		}
	}

	if err := tx.Model(&schema.Company{}).Where("id = ?", companyToUpdate.ID).Updates(companyToUpdate).Error; err != nil {
		return err
	}

	return nil
}

func DeleteCompanyRepository(tx *gorm.DB, companyID, userID uint) error {
	if err := tx.Delete(&schema.Company{}, companyID).Error; err != nil {
		return err
	}

	if err := tx.Delete(&schema.User{}, userID).Error; err != nil {
		return err
	}

	return nil
}
