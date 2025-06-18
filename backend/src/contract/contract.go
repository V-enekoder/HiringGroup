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

type PaymentSummaryDTO struct {
	ContractID             uint    `json:"contractId"`
	CandidateName          string  `json:"candidateName"`
	CompanyName            string  `json:"companyName"`
	PaymentsCount          int64   `json:"paymentsCount"`
	TotalGrossAmount       float64 `json:"totalGrossAmount"`
	TotalHiringGroupFee    float64 `json:"totalHiringGroupFee"`
	TotalINCESFee          float64 `json:"totalINCESFee"`
	TotalSocialSecurityFee float64 `json:"totalSocialSecurityFee"`
	TotalNetAmount         float64 `json:"totalNetAmount"`
}
