package employeehg

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrUserEmailExists = errors.New("a user with this email already exists")
)

// mapToEmployeeHGResponseDTO convierte un schema.EmployeeHG (con su User pre-cargado) a un DTO.
func mapToEmployeeHGResponseDTO(e schema.EmployeeHG) EmployeeHGResponseDTO {
	return EmployeeHGResponseDTO{
		ID:     e.ID,
		UserID: e.UserID,
		Name:   e.User.Name,
		Email:  e.User.Email,
		Role:   e.User.Role.Name,
	}
}

// CreateEmployeeHGService maneja la lógica para crear un User y un EmployeeHG.
func CreateEmployeeHGService(dto EmployeeHGCreateDTO) (EmployeeHGResponseDTO, error) {
	exists, err := UserEmailExistsRepository(dto.Email)
	if err != nil {
		return EmployeeHGResponseDTO{}, err
	}
	if exists {
		return EmployeeHGResponseDTO{}, ErrUserEmailExists
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return EmployeeHGResponseDTO{}, err
	}

	newUser := schema.User{
		Name:     dto.Name,
		Email:    dto.Email,
		Password: string(hashedPassword),
		RoleID:   dto.RoleID,
	}

	createdEmployee, err := CreateEmployeeHGRepository(&newUser)
	if err != nil {
		return EmployeeHGResponseDTO{}, err
	}

	return mapToEmployeeHGResponseDTO(createdEmployee), nil
}

// GetAllEmployeesHGService recupera todos los empleados de HG.
func GetAllEmployeesHGService() ([]EmployeeHGResponseDTO, error) {
	employees, err := GetAllEmployeesHGRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []EmployeeHGResponseDTO
	for _, e := range employees {
		responseDTOs = append(responseDTOs, mapToEmployeeHGResponseDTO(e))
	}
	return responseDTOs, nil
}

// GetEmployeeHGByIDService recupera un empleado por su ID.
func GetEmployeeHGByIDService(id uint) (EmployeeHGResponseDTO, error) {
	employee, err := GetEmployeeHGByIDRepository(id)
	if err != nil {
		return EmployeeHGResponseDTO{}, err
	}
	return mapToEmployeeHGResponseDTO(employee), nil
}

// UpdateEmployeeHGService actualiza los datos de un empleado (su perfil de usuario).
func UpdateEmployeeHGService(id uint, dto EmployeeHGUpdateDTO) (EmployeeHGResponseDTO, error) {
	updateData := map[string]interface{}{
		"name":    dto.Name,
		"role_id": dto.RoleID,
	}

	if err := UpdateEmployeeHGRepository(id, updateData); err != nil {
		return EmployeeHGResponseDTO{}, err
	}

	return GetEmployeeHGByIDService(id)
}

// DeleteEmployeeHGService elimina un empleado y su usuario asociado.
func DeleteEmployeeHGService(id uint) error {
	err := DeleteEmployeeHGRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
