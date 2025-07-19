package contract

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func CreateContract(contract *schema.Contract, candidateID uint, postulationID uint) error {
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

		if err := tx.Model(&schema.Postulation{}).Where("id = ?", postulationID).Update("active", false).Error; err != nil {
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

func GetPaymentSummaryRepository(contractID uint) (PaymentSummaryDTO, error) {
	var summary PaymentSummaryDTO
	db := config.DB

	// Construimos la consulta con SELECT para sumar y contar.
	// Esto es mucho más eficiente que traer todos los registros.
	err := db.Model(&schema.Payment{}).
		Select(`
			COUNT(*) as payments_count,
			SUM(amount) as total_gross_amount,
			SUM(hiring_group_fee) as total_hiring_group_fee,
			SUM(inces_fee) as total_inces_fee,
			SUM(social_security_fee) as total_social_security_fee,
			SUM(net_amount) as total_net_amount
		`).
		Where("contract_id = ?", contractID).
		Group("contract_id"). // Agrupar es buena práctica en agregaciones
		Scan(&summary).Error

	// Si no hay pagos, GORM podría devolver ErrRecordNotFound.
	// En este caso, no es un error, simplemente devolvemos un resumen vacío (con ceros).
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return PaymentSummaryDTO{}, err
	}

	return summary, nil
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
