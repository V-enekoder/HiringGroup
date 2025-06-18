package contract

import (
	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func CreateContract(contract *schema.Contract, candidateID uint) error {
	db := config.DB
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar si ya existe un contrato para esta postulación dentro de la transacción
		var existing schema.Contract
		if err := tx.Where("postulation_id = ?", contract.PostulationID).First(&existing).Error; err == nil {
			return ErrContractExists
		}

		// 2. Crear el contrato
		if err := tx.Create(contract).Error; err != nil {
			return err
		}

		// 3. Actualizar al candidato a Hired = true
		if err := tx.Model(&schema.Candidate{}).Where("id = ?", candidateID).Update("hired", true).Error; err != nil {
			return err
		}
		return nil
	})
}

func GetAllContractsRepository() ([]schema.Contract, error) {
	var contracts []schema.Contract
	db := config.DB
	err := db.Preload("Postulation.Candidate.User").
		Preload("Postulation.JobOffer.Company").
		Preload("ContractingPeriod").
		Preload("Payments").
		Find(&contracts).Error
	return contracts, err
}

func GetContractByIDRepository(id uint) (schema.Contract, error) {
	var c schema.Contract
	db := config.DB
	err := db.Preload("Postulation.Candidate.User").
		Preload("Postulation.JobOffer.Company").
		Preload("ContractingPeriod").
		Preload("Payments").
		First(&c, id).Error
	return c, err
}

func UpdateContractRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.Contract{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func DeleteContractRepository(id uint) error {
	db := config.DB
	return db.Delete(&schema.Contract{}, id).Error
}
