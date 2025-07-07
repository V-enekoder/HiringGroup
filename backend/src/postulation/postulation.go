package postulation

type PostulationCreateDTO struct {
	CandidateID uint `json:"candidateId" binding:"required"`
	JobID       uint `json:"jobId" binding:"required"`
}

type PostulationUpdateDTO struct {
	Active *bool `json:"active" binding:"required"`
}

type PostulationResponseDTO struct {
	ID                  uint    `json:"id"`
	Active              bool    `json:"active"`
	CandidateID         uint    `json:"candidateId"`
	CandidateName       string  `json:"candidateName"`
	CandidateEmail      string  `json:"candidateEmail"`
	JobOfferPosition    string  `json:"jobOfferPosition"`
	JobOfferSalary      float64 `json:"jobOfferSalary"`
	JobOfferCompanyName string  `json:"jobOfferCompanyName"`
	HasContract         bool    `json:"hasContract"`
}
