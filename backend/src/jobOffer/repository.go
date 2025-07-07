package jobOffer

import (
	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
)

func CreateJobOfferRepository(jobOffer *schema.JobOffer) error {
	db := config.DB
	return db.Create(jobOffer).Error
}

func GetAllJobOffersRepository() ([]schema.JobOffer, error) {
	var jobOffers []schema.JobOffer
	db := config.DB
	// Precargamos las relaciones para tener la info completa en el DTO de respuesta
	err := db.Preload("Company").Preload("Profession").Preload("Zone").Find(&jobOffers).Error
	return jobOffers, err
}

func GetAllActiveJobOffersRepository() ([]schema.JobOffer, error) {
	var jobOffers []schema.JobOffer
	db := config.DB
	err := db.Preload("Company").
		Preload("Profession").
		Preload("Zone").
		Where("active = ?", true).
		Find(&jobOffers).Error

	return jobOffers, err
}

func GetJobOfferByIDRepository(id uint) (schema.JobOffer, error) {
	var jobOffer schema.JobOffer
	db := config.DB
	err := db.Preload("Company").Preload("Profession").Preload("Zone").First(&jobOffer, id).Error
	return jobOffer, err
}

func UpdateJobOfferRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	return db.Model(&schema.JobOffer{}).Where("id = ?", id).Updates(data).Error
}

func DeleteJobOfferRepository(id uint) error {
	db := config.DB
	return db.Delete(&schema.JobOffer{}, id).Error
}
