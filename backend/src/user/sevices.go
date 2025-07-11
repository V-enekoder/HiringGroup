package user

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// --- SERVICIO DE REGISTRO (REEMPLAZA A CreateUserService) ---
func RegisterUserService(dto RegisterRequestDTO) error {
	// 1. Verificar si el email ya existe (reutilizamos tu función existente)
	if exists, err := UserExistsByFieldService("email", dto.Email, 0); err != nil {
		return err
	} else if exists {
		return HandleUniquenessError("email") // Devuelve "Correo ya registrado"
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

	// 4. Crear el perfil correspondiente
	var profile interface{}
	// NOTA: Asume IDs de rol predefinidos. ¡Ajústalos!
	switch dto.RoleID {
	case 4: // Asumimos rol de Candidato
		if dto.LastName == "" || dto.Document == "" {
			return errors.New("lastname and document are required for a candidate")
		}
		profile = &schema.Candidate{
			LastName:    dto.LastName,
			Document:    dto.Document,
			PhoneNumber: dto.PhoneNumber,
			Address:     dto.Address,
			BloodType:   dto.BloodType,
		}
	case 3: // Asumimos rol de Empresa
		if dto.CompanyName == "" {
			return errors.New("company name is required for a company")
		}
		profile = &schema.Company{
			Name:    dto.CompanyName,
			Sector:  dto.CompanySector,
			Address: dto.CompanyAddress,
		}
	default:
		return fmt.Errorf("invalid or unsupported role id: %d", dto.RoleID)
	}

	// 5. Llamar al repositorio para crearlos en una transacción
	return CreateUserAndProfileRepository(newUser, profile)
}

// --- NUEVO SERVICIO DE LOGIN ---
func LoginUserService(dto LoginRequestDTO) (LoginResponseDTO, error) {
	// 1. Encontrar al usuario por email con sus perfiles
	user, err := FindUserByEmailRepository(dto.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return LoginResponseDTO{}, errors.New("credenciales inválidas")
		}
		return LoginResponseDTO{}, err // Otro error de BD
	}

	// 2. Comparar la contraseña
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password))
	if err != nil {
		return LoginResponseDTO{}, errors.New("credenciales inválidas") // Error intencionalmente genérico
	}

	// 3. Construir la respuesta
	response := LoginResponseDTO{
		UserID: user.ID,
		Name:   user.Name,
		Email:  user.Email,
		Role:   user.Role.Name, // Asume que el modelo Role tiene un campo Name
	}

	// Asignar el ID del perfil específico
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

func CreateUserService(userDTO UserCreateDTO) (uint, error) {
	if exists, err := UserExistsByFieldService("email", userDTO.Email, 0); err != nil {
		return 0, err
	} else if exists {
		return 0, HandleUniquenessError("email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userDTO.Password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	user := schema.User{
		Name:     userDTO.Name,
		Email:    userDTO.Email,
		Password: string(hashedPassword),
	}

	id, err := CreateUserRepository(user)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func UserExistsByFieldService(field string, value interface{}, excludeId uint) (bool, error) {
	return UserExistsByFieldRepository(field, value, excludeId)
}

func HandleUniquenessError(type_ string) error {
	switch type_ {
	case "email":
		return errors.New("correo ya registrado")
	default:
		return nil
	}
}

func GetUserByIdService(id uint) (UserResponseDTO, error) {
	user, err := GetUserByIdRepository(id)
	if err != nil {
		return UserResponseDTO{}, err
	}

	userResponse := UserResponseDTO{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	return userResponse, nil
}

func UpdatePasswordUserService(id uint, password UserUpdatePasswordDTO) error {
	dbPassword, err := GetPasswordUserRepository(id)
	if err != nil {
		return err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(password.OldPassword)); err != nil {
		return errors.New("invalid old password")
	}

	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(password.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	err = UpdatePasswordUserRepository(id, string(hashedNewPassword))
	return err
}

func UpdateUserService(id uint, userDTO UserUpdateDTO) error {
	err := UpdateUserRepository(id, userDTO)
	if err != nil {
		return err
	}

	return nil
}

func DeleteUserByIdService(id uint) error {
	err := DeleteUserbyIDRepository(id)
	if err != nil {
		return err
	}

	return nil
}
