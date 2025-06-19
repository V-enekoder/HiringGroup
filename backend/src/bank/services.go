package bank

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// ErrBankExists es un error personalizado para cuando un banco con el mismo nombre ya existe.
var ErrBankExists = errors.New("a bank with this name already exists")

// mapToBankResponseDTO convierte un schema.Bank a un BankResponseDTO.
func mapToBankResponseDTO(b schema.Bank) BankResponseDTO {
	return BankResponseDTO{
		ID:   b.ID,
		Name: b.Name,
	}
}

// CreateBankService maneja la lógica para crear un nuevo banco.
func CreateBankService(dto BankCreateDTO) (BankResponseDTO, error) {
	exists, err := BankExistsByNameRepository(dto.Name)
	if err != nil {
		return BankResponseDTO{}, err
	}
	if exists {
		return BankResponseDTO{}, ErrBankExists
	}

	newBank := schema.Bank{
		Name: dto.Name,
	}

	if err := CreateBankRepository(&newBank); err != nil {
		return BankResponseDTO{}, err
	}

	return mapToBankResponseDTO(newBank), nil
}

// GetAllBanksService recupera todos los bancos.
func GetAllBanksService() ([]BankResponseDTO, error) {
	banks, err := GetAllBanksRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []BankResponseDTO
	for _, b := range banks {
		responseDTOs = append(responseDTOs, mapToBankResponseDTO(b))
	}
	return responseDTOs, nil
}

// GetBankByIDService recupera un banco por su ID.
func GetBankByIDService(id uint) (BankResponseDTO, error) {
	b, err := GetBankByIDRepository(id)
	if err != nil {
		// GORM devuelve gorm.ErrRecordNotFound si no lo encuentra.
		return BankResponseDTO{}, err
	}
	return mapToBankResponseDTO(b), nil
}

// UpdateBankService maneja la lógica para actualizar un banco.
func UpdateBankService(id uint, dto BankUpdateDTO) (BankResponseDTO, error) {
	// Opcional: Verificar si el nuevo nombre ya existe en otro banco.
	// exists, err := BankExistsByNameRepository(dto.Name)
	// if err != nil { return BankResponseDTO{}, err }
	// if exists { return BankResponseDTO{}, ErrBankExists }

	updateData := map[string]interface{}{"name": dto.Name}

	if err := UpdateBankRepository(id, updateData); err != nil {
		return BankResponseDTO{}, err
	}

	// Devuelve el banco actualizado.
	return GetBankByIDService(id)
}

// DeleteBankService maneja la lógica para eliminar un banco.
func DeleteBankService(id uint) error {
	err := DeleteBankRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		// Ignoramos el error si el registro ya no existía, pero reportamos otros errores.
		return err
	}
	return nil
}
