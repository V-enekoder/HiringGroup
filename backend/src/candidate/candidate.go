package candidate

import "time"

type CandidateCreateDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`

	LastName    string    `json:"lastName" binding:"required"`
	Document    string    `json:"document" binding:"required"`
	BloodType   string    `json:"bloodType"`
	Address     string    `json:"address"`
	PhoneNumber string    `json:"phoneNumber"`
	DateOfBirth time.Time `json:"dateOfBirth" binding:"required"`
}

type CandidateUpdateDTO struct {
	Name *string `json:"name"` // Usamos punteros para poder diferenciar un valor vacío de uno no enviado

	// Candidate fields
	LastName    *string `json:"lastName"`
	Document    *string `json:"document"`
	BloodType   *string `json:"bloodType"`
	Address     *string `json:"address"`
	PhoneNumber *string `json:"phoneNumber"`
}

type CandidateResponseDTO struct {
	ID          uint      `json:"candidate_id"`
	Role        string    `json:"role"` // Nombre del rol para claridad
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	LastName    string    `json:"lastName"`
	Document    string    `json:"document"`
	BloodType   string    `json:"bloodType"`
	Address     string    `json:"address"`
	PhoneNumber string    `json:"phoneNumber"`
	DateOfBirth time.Time `json:"dateOfBirth"`
	Hired       bool      `json:"hired"`
}
