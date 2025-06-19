package contractingperiod

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Errores personalizados para la lógica de negocio.
var (
	ErrPeriodExists       = errors.New("a contracting period with this name already exists")
	ErrPeriodHasContracts = errors.New("cannot delete contracting period because it has associated contracts")
)

// mapToPeriodResponseDTO convierte un schema.ContractingPeriod a un ContractingPeriodResponseDTO.
func mapToPeriodResponseDTO(p schema.ContractingPeriod) ContractingPeriodResponseDTO {
	return ContractingPeriodResponseDTO{
		ID:   p.ID,
		Name: p.Name,
	}
}

// CreatePeriodService maneja la lógica para crear un nuevo período de contratación.
func CreatePeriodService(dto ContractingPeriodCreateDTO) (ContractingPeriodResponseDTO, error) {
	exists, err := PeriodExistsByNameRepository(dto.Name)
	if err != nil {
		return ContractingPeriodResponseDTO{}, err
	}
	if exists {
		return ContractingPeriodResponseDTO{}, ErrPeriodExists
	}

	newPeriod := schema.ContractingPeriod{
		Name: dto.Name,
	}

	if err := CreatePeriodRepository(&newPeriod); err != nil {
		return ContractingPeriodResponseDTO{}, err
	}

	return mapToPeriodResponseDTO(newPeriod), nil
}

// GetAllPeriodsService recupera todos los períodos de contratación.
func GetAllPeriodsService() ([]ContractingPeriodResponseDTO, error) {
	periods, err := GetAllPeriodsRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []ContractingPeriodResponseDTO
	for _, p := range periods {
		responseDTOs = append(responseDTOs, mapToPeriodResponseDTO(p))
	}
	return responseDTOs, nil
}

// GetPeriodByIDService recupera un período de contratación por su ID.
func GetPeriodByIDService(id uint) (ContractingPeriodResponseDTO, error) {
	p, err := GetPeriodByIDRepository(id)
	if err != nil {
		return ContractingPeriodResponseDTO{}, err
	}
	return mapToPeriodResponseDTO(p), nil
}

// UpdatePeriodService maneja la lógica para actualizar un período de contratación.
func UpdatePeriodService(id uint, dto ContractingPeriodUpdateDTO) (ContractingPeriodResponseDTO, error) {
	updateData := map[string]interface{}{"name": dto.Name}

	if err := UpdatePeriodRepository(id, updateData); err != nil {
		return ContractingPeriodResponseDTO{}, err
	}

	return GetPeriodByIDService(id)
}

// DeletePeriodService maneja la lógica para eliminar un período de contratación.
func DeletePeriodService(id uint) error {
	// La validación de si tiene contratos asociados se hace en el repositorio antes de eliminar.
	err := DeletePeriodRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
