package payment

import (
	"errors"
	"time"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Constantes para las tasas de deducción, tomadas de la lógica del seeder.
const (
	hiringGroupFeeRate    = 0.02  // 2%
	incesFeeRate          = 0.005 // 0.5%
	socialSecurityFeeRate = 0.01  // 1%
)

// mapToResponseDTO es un helper para convertir el modelo a DTO de respuesta.
func mapToResponseDTO(p schema.Payment) PaymentResponseDTO {
	return PaymentResponseDTO{
		ID:                p.ID,
		ContractID:        p.ContractID,
		Date:              p.Date,
		Amount:            p.Amount,
		HiringGroupFee:    p.HiringGroupFee,
		INCESFee:          p.INCESFee,
		SocialSecurityFee: p.SocialSecurityFee,
		NetAmount:         p.NetAmount,
		CandidateName:     p.Contract.Postulation.Candidate.User.Name + " " + p.Contract.Postulation.Candidate.LastName,
		JobOfferPosition:  p.Contract.Postulation.JobOffer.OpenPosition,
		CompanyName:       p.Contract.Postulation.JobOffer.Company.Name,
	}
}

// CreatePaymentService busca el salario, calcula deducciones y crea el pago.
func CreatePaymentService(dto PaymentCreateDTO) (PaymentResponseDTO, error) {
	// 1. Obtener el contrato y la información necesaria para el cálculo (el salario).
	contract, err := GetContractForPaymentCreationRepository(dto.ContractID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return PaymentResponseDTO{}, errors.New("contract not found")
		}
		return PaymentResponseDTO{}, err
	}

	grossSalary := contract.Postulation.JobOffer.Salary
	if grossSalary <= 0 {
		return PaymentResponseDTO{}, errors.New("the salary for this contract is zero or invalid")
	}

	// 2. Calcular las tarifas y deducciones.
	hiringGroupFee := grossSalary * hiringGroupFeeRate
	incesFee := grossSalary * incesFeeRate
	socialSecurityFee := grossSalary * socialSecurityFeeRate
	netAmount := grossSalary - hiringGroupFee - incesFee - socialSecurityFee

	// 3. Crear el objeto de pago completo.
	newPayment := schema.Payment{
		ContractID:        dto.ContractID,
		Date:              time.Now(),
		Amount:            grossSalary,
		HiringGroupFee:    hiringGroupFee,
		INCESFee:          incesFee,
		SocialSecurityFee: socialSecurityFee,
		NetAmount:         netAmount,
	}

	// 4. Guardar el pago en la base de datos.
	if err := CreatePaymentRepository(&newPayment); err != nil {
		return PaymentResponseDTO{}, err
	}

	// 5. Devolver la respuesta completa.
	return GetPaymentByIDService(newPayment.ID)
}

// GetAllPaymentsService recupera todos los pagos.
func GetAllPaymentsService() ([]PaymentResponseDTO, error) {
	payments, err := GetAllPaymentsRepository()
	if err != nil {
		return nil, err
	}
	var responseDTOs []PaymentResponseDTO
	for _, p := range payments {
		responseDTOs = append(responseDTOs, mapToResponseDTO(p))
	}
	return responseDTOs, nil
}

// GetPaymentByIDService recupera un pago por su ID.
func GetPaymentByIDService(id uint) (PaymentResponseDTO, error) {
	p, err := GetPaymentByIDRepository(id)
	if err != nil {
		return PaymentResponseDTO{}, err
	}
	return mapToResponseDTO(p), nil
}
