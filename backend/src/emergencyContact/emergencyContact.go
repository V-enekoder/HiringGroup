package emergencycontact

// EmergencyContactCreateDTO define la estructura para crear un nuevo contacto de emergencia.
type EmergencyContactCreateDTO struct {
	CandidateID uint   `json:"candidate_id" binding:"required"`
	Name        string `json:"name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
}

// EmergencyContactUpdateDTO define la estructura para actualizar un contacto de emergencia.
type EmergencyContactUpdateDTO struct {
	Name        string `json:"name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
}

type EmergencyContactResponseDTO struct {
	ID          uint   `json:"id"`
	CandidateID uint   `json:"candidate_id"`
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
}
