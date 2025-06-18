package payment

import "time"

type PaymentCreateDTO struct {
	ContractID uint `json:"contractId" binding:"required"`
}

// PaymentResponseDTO define la estructura de respuesta completa para un pago.
type PaymentResponseDTO struct {
	ID                uint      `json:"id"`
	ContractID        uint      `json:"contractId"`
	Date              time.Time `json:"date"`
	Amount            float64   `json:"amount"` // Salario Bruto
	HiringGroupFee    float64   `json:"hiringGroupFee"`
	INCESFee          float64   `json:"incesFee"`
	SocialSecurityFee float64   `json:"socialSecurityFee"`
	NetAmount         float64   `json:"netAmount"` // Salario Neto
	// Datos de contexto para el frontend
	CandidateName    string `json:"candidateName"`
	JobOfferPosition string `json:"jobOfferPosition"`
	CompanyName      string `json:"companyName"`
}
