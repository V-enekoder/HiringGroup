package contract

type ContractCreateDTO struct {
	PostulationID uint `json:"postulationId" binding:"required"`
	PeriodID      uint `json:"periodId" binding:"required"`
}

type ContractUpdateDTO struct {
	PeriodID *uint `json:"periodId"`
	Active   *bool `json:"active"`
}

type ContractResponseDTO struct {
	ID               uint    `json:"id"`
	Active           bool    `json:"active"`
	PostulationID    uint    `json:"postulationId"`
	PeriodID         uint    `json:"periodId"`
	PeriodName       string  `json:"periodName"`
	CandidateName    string  `json:"candidateName"`
	CandidateEmail   string  `json:"candidateEmail"`
	JobOfferPosition string  `json:"jobOfferPosition"`
	JobOfferSalary   float64 `json:"jobOfferSalary"`
	CompanyName      string  `json:"companyName"`
	PaymentsCount    int     `json:"paymentsCount"`
}
