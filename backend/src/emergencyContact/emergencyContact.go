package emergencycontact

// EmergencyContactCreateDTO define la estructura para crear un nuevo contacto de emergencia.
type EmergencyContactCreateDTO struct {
	Document    string `json:"document" binding:"required"`
	Name        string `json:"name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
}

// EmergencyContactUpdateDTO define la estructura para actualizar un contacto de emergencia.
type EmergencyContactUpdateDTO struct {
	Document    string `json:"document" binding:"required"`
	Name        string `json:"name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
}

type EmergencyContactResponseDTO struct {
	ID          uint   `json:"id"`
	Document    string `json:"document"`
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
}
