package auth

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/src/schema"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// RegisterUserService maneja la lógica para registrar un nuevo usuario.
func RegisterUserService(dto RegisterRequestDTO) error {
	// 1. Verificar si el email ya existe
	_, err := FindUserByEmail(dto.Email)
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Si el error NO es "no encontrado", significa que el usuario ya existe o hubo otro error.
		return errors.New("email already in use")
	}

	// 2. Hashear la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// 3. Crear el objeto User
	newUser := &schema.User{
		Name:     dto.Name,
		Email:    dto.Email,
		Password: string(hashedPassword),
		RoleID:   dto.RoleID,
	}

	// 4. Crear el objeto de perfil correspondiente según el RoleID
	var profile interface{}
	// NOTA: Asume que tienes IDs de rol predefinidos. ¡Ajústalos si es necesario!
	switch dto.RoleID {
	case 4: // Asumimos que 4 es el ID para el rol 'Candidate'
		if dto.LastName == "" || dto.Document == "" {
			return errors.New("lastname and document are required for a candidate")
		}
		profile = &schema.Candidate{
			LastName: dto.LastName,
			Document: dto.Document,
		}
	case 3: // Asumimos que 3 es el ID para 'Company'
		if dto.CompanyName == "" {
			return errors.New("company name is required for a company")
		}
		profile = &schema.Company{
			Name:    dto.CompanyName,
			Sector:  dto.Sector,
			Address: dto.Address,
		}
	default:
		return fmt.Errorf("invalid or unsupported role id: %d", dto.RoleID)
	}

	// 5. Llamar al repositorio para crear ambos en una transacción
	return CreateUserAndProfile(newUser, profile)
}

// LoginUserService maneja la lógica para el inicio de sesión.
func LoginUserService(dto LoginRequestDTO) (LoginResponseDTO, error) {
	// 1. Encontrar al usuario por su email
	user, err := FindUserByEmail(dto.Email)
	if err != nil {
		// Si no se encuentra, devolvemos un error genérico por seguridad.
		return LoginResponseDTO{}, errors.New("invalid credentials")
	}

	// 2. Comparar la contraseña hasheada con la proporcionada
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password))
	if err != nil {
		// Si las contraseñas no coinciden, bcrypt devuelve un error.
		return LoginResponseDTO{}, errors.New("invalid credentials")
	}

	// 3. Construir la respuesta con los datos del perfil correcto
	response := LoginResponseDTO{
		UserID: user.ID,
		Name:   user.Name,
		Email:  user.Email,
		Role:   user.Role.Name, // Asumiendo que el modelo Role tiene un campo Name
	}

	// Asignar el ID del perfil específico (CandidateID, CompanyID, etc.)
	if user.Candidate != nil {
		response.ProfileID = user.Candidate.ID
	} else if user.Company != nil {
		response.ProfileID = user.Company.ID
	} else if user.Admin != nil {
		response.ProfileID = user.Admin.ID
	} else if user.EmployeeHG != nil {
		response.ProfileID = user.EmployeeHG.ID
	}

	return response, nil
}
