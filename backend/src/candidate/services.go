package candidate

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/config" // Asumiendo que aquí está la conexión DB
	"github.com/V-enekoder/HiringGroup/src/schema"
	"github.com/V-enekoder/HiringGroup/src/user" // Importamos el paquete de usuario para sus servicios/helpers
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// CreateCandidateService maneja la lógica de crear un User y un Candidate.
func CreateCandidateService(dto CandidateCreateDTO) (CandidateResponseDTO, error) {
	if exists, err := user.UserExistsByFieldService("email", dto.Email, 0); err != nil {
		return CandidateResponseDTO{}, err
	} else if exists {
		return CandidateResponseDTO{}, user.HandleUniquenessError("email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return CandidateResponseDTO{}, errors.New("error hashing password")
	}

	// 3. Preparar las entidades
	newUser := schema.User{
		Name:     dto.Name,
		Email:    dto.Email,
		Password: string(hashedPassword),
		RoleID:   4, // Asumimos que 4 es el ID para el rol "Candidato". ¡Esto debería ser una constante!
	}
	newCandidate := schema.Candidate{
		LastName:    dto.LastName,
		Document:    dto.Document,
		BloodType:   dto.BloodType,
		Address:     dto.Address,
		PhoneNumber: dto.PhoneNumber,
		DateOfBirth: dto.DateOfBirth,
		Hired:       false, // Por defecto, no está contratado
	}

	// 4. Iniciar transacción
	db := config.DB
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return CandidateResponseDTO{}, err
	}

	c, err := CreateCandidateRepository(&newUser, &newCandidate)
	if err != nil {
		tx.Rollback()
		return CandidateResponseDTO{}, fmt.Errorf("could not create candidate: %w", err)
	}

	/*if err := tx.Commit().Error; err != nil {
		return CandidateResponseDTO{}, err
	}*/

	response := CandidateResponseDTO{
		ID:   newCandidate.ID,
		Role: c.User.Role.Name, // Asumimos que el rol ya está precargado en la consulta
		Name: newUser.Name,

		Email:       newUser.Email,
		LastName:    newCandidate.LastName,
		Document:    newCandidate.Document,
		BloodType:   newCandidate.BloodType,
		Address:     newCandidate.Address,
		PhoneNumber: newCandidate.PhoneNumber,
		DateOfBirth: newCandidate.DateOfBirth,
		Hired:       newCandidate.Hired,
	}

	return response, nil
}

func GetAllCandidatesService() ([]CandidateResponseDTO, error) {
	candidates, err := GetAllCandidatesRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []CandidateResponseDTO
	for _, c := range candidates {
		responseDTOs = append(responseDTOs, CandidateResponseDTO{
			ID:          c.ID,
			Role:        c.User.Role.Name, // Gracias a Preload, tenemos acceso directo
			Name:        c.User.Name,
			Email:       c.User.Email,
			LastName:    c.LastName,
			Document:    c.Document,
			BloodType:   c.BloodType,
			Address:     c.Address,
			PhoneNumber: c.PhoneNumber,
			DateOfBirth: c.DateOfBirth,
			Hired:       c.Hired,
		})
	}
	return responseDTOs, nil
}

func GetCandidateByIDService(id uint) (CandidateResponseDTO, error) {
	c, err := GetCandidateByIDRepository(id)
	if err != nil {
		return CandidateResponseDTO{}, err
	}

	response := CandidateResponseDTO{
		ID:          c.ID,
		Role:        c.User.Role.Name,
		Name:        c.User.Name,
		Email:       c.User.Email,
		LastName:    c.LastName,
		Document:    c.Document,
		BloodType:   c.BloodType,
		Address:     c.Address,
		PhoneNumber: c.PhoneNumber,
		DateOfBirth: c.DateOfBirth,
		Hired:       c.Hired,
	}

	return response, nil
}

func UpdateCandidateService(id uint, dto CandidateUpdateDTO) (CandidateResponseDTO, error) {
	existingCandidate, err := GetCandidateByIDRepository(id)
	if err != nil {
		return CandidateResponseDTO{}, errors.New("candidate not found")
	}

	// 2. Preparar los datos a actualizar
	userToUpdate := schema.User{ID: existingCandidate.UserID}
	if dto.Name != nil {
		userToUpdate.Name = *dto.Name
	}

	candidateToUpdate := schema.Candidate{ID: id}
	if dto.LastName != nil {
		candidateToUpdate.LastName = *dto.LastName
	}
	if dto.Document != nil {
		candidateToUpdate.Document = *dto.Document
	}
	// ... (repetir para todos los campos de CandidateUpdateDTO)
	if dto.Address != nil {
		candidateToUpdate.Address = *dto.Address
	}
	if dto.PhoneNumber != nil {
		candidateToUpdate.PhoneNumber = *dto.PhoneNumber
	}
	if dto.BloodType != nil {
		candidateToUpdate.BloodType = *dto.BloodType
	}

	// 3. Iniciar transacción
	db := config.DB
	tx := db.Begin()
	if err := UpdateCandidateRepository(tx, &candidateToUpdate, &userToUpdate); err != nil {
		tx.Rollback()
		return CandidateResponseDTO{}, err
	}
	tx.Commit()

	// 4. Devolver la entidad actualizada
	return GetCandidateByIDService(id)
}

// DeleteCandidateService borra un candidato y su usuario asociado.
func DeleteCandidateService(id uint) error {
	// 1. Obtener el candidato para saber su UserID
	candidate, err := GetCandidateByIDRepository(id)
	if err != nil {
		// Si no se encuentra, consideramos la operación exitosa.
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	// 2. Iniciar transacción y borrar ambos
	db := config.DB
	tx := db.Begin()
	if err := DeleteCandidateRepository(tx, id, candidate.UserID); err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}
