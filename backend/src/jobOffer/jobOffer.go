package jobOffer

type JobOfferCreateDTO struct {
	CompanyID    uint    `json:"companyId" binding:"required"`
	ProfessionID uint    `json:"professionId" binding:"required"`
	ZoneID       uint    `json:"zoneId" binding:"required"`
	Description  string  `json:"description" binding:"required"`
	OpenPosition string  `json:"openPosition" binding:"required"`
	Salary       float64 `json:"salary" binding:"required"`
}

type JobOfferUpdateDTO struct {
	ProfessionID *uint    `json:"professionId"`
	ZoneID       *uint    `json:"zoneId"`
	Active       *bool    `json:"active"`
	Description  *string  `json:"description"`
	OpenPosition *string  `json:"openPosition"`
	Salary       *float64 `json:"salary"`
}

type JobOfferResponseDTO struct {
	ID             uint    `json:"id"`
	CompanyID      uint    `json:"companyId"`
	CompanyName    string  `json:"companyName"`
	ProfessionName string  `json:"professionName"`
	ZoneName       string  `json:"zoneName"`
	Active         bool    `json:"active"`
	Description    string  `json:"description"`
	OpenPosition   string  `json:"openPosition"`
	Salary         float64 `json:"salary"`
}
