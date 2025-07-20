package payment

import (
	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
)

// GetContractForPaymentCreationRepository obtiene un contrato con la info de la oferta para calcular el salario.
func GetContractForPaymentCreationRepository(contractID uint) (schema.Contract, error) {
	var contract schema.Contract
	db := config.DB
	err := db.Preload("Postulation.JobOffer").First(&contract, contractID).Error
	return contract, err
}

// CreatePaymentRepository guarda un nuevo registro de pago.
func CreatePaymentRepository(p *schema.Payment) error {
	db := config.DB
	return db.Create(p).Error
}

// GetAllPaymentsRepository obtiene todos los pagos con datos de contexto.
func GetAllPaymentsRepository() ([]schema.Payment, error) {
	var payments []schema.Payment
	db := config.DB
	err := db.Preload("Contract.Postulation.Candidate.User").
		Preload("Contract.Postulation.JobOffer.Company").
		Find(&payments).Error
	return payments, err
}

// GetPaymentByIDRepository obtiene un pago por ID con datos de contexto.
func GetPaymentByIDRepository(id uint) (schema.Payment, error) {
	var p schema.Payment
	db := config.DB
	err := db.Preload("Contract.Postulation.Candidate.User").
		Preload("Contract.Postulation.JobOffer.Company").
		First(&p, id).Error
	return p, err
}

func GetPaymentsByCompanyIDRepository(companyID uint) ([]schema.Payment, error) {
	var payments []schema.Payment
	db := config.DB
	err := db.
		Joins("JOIN contracts ON contracts.id = payments.contract_id").
		Joins("JOIN postulations ON postulations.id = contracts.postulation_id").
		Joins("JOIN job_offers ON job_offers.id = postulations.job_id").
		Where("job_offers.company_id = ?", companyID).
		Preload("Contract.Postulation.Candidate.User").
		Preload("Contract.Postulation.JobOffer.Company").
		Find(&payments).Error

	return payments, err
}