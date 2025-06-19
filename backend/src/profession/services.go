package profession

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Errores personalizados para la lógica de negocio de Profession.
var (
	ErrProfessionExists = errors.New("a profession with this name already exists")
	ErrProfessionInUse  = errors.New("cannot delete profession as it is currently in use by curriculums or job offers")
)

// mapToProfessionResponseDTO convierte un schema.Profession a un ProfessionResponseDTO.
func mapToProfessionResponseDTO(p schema.Profession) ProfessionResponseDTO {
	return ProfessionResponseDTO{
		ID:   p.ID,
		Name: p.Name,
	}
}

// CreateProfessionService maneja la lógica para crear una nueva profesión.
func CreateProfessionService(dto ProfessionCreateDTO) (ProfessionResponseDTO, error) {
	exists, err := ProfessionExistsByNameRepository(dto.Name)
	if err != nil {
		return ProfessionResponseDTO{}, err
	}
	if exists {
		return ProfessionResponseDTO{}, ErrProfessionExists
	}

	newProfession := schema.Profession{
		Name: dto.Name,
	}

	if err := CreateProfessionRepository(&newProfession); err != nil {
		return ProfessionResponseDTO{}, err
	}

	return mapToProfessionResponseDTO(newProfession), nil
}

// GetAllProfessionsService recupera todas las profesiones.
func GetAllProfessionsService() ([]ProfessionResponseDTO, error) {
	professions, err := GetAllProfessionsRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []ProfessionResponseDTO
	for _, p := range professions {
		responseDTOs = append(responseDTOs, mapToProfessionResponseDTO(p))
	}
	return responseDTOs, nil
}

// GetProfessionByIDService recupera una profesión por su ID.
func GetProfessionByIDService(id uint) (ProfessionResponseDTO, error) {
	p, err := GetProfessionByIDRepository(id)
	if err != nil {
		return ProfessionResponseDTO{}, err
	}
	return mapToProfessionResponseDTO(p), nil
}

// UpdateProfessionService maneja la lógica para actualizar una profesión.
func UpdateProfessionService(id uint, dto ProfessionUpdateDTO) (ProfessionResponseDTO, error) {
	updateData := map[string]interface{}{"name": dto.Name}

	if err := UpdateProfessionRepository(id, updateData); err != nil {
		return ProfessionResponseDTO{}, err
	}

	return GetProfessionByIDService(id)
}

// DeleteProfessionService maneja la lógica para eliminar una profesión.
func DeleteProfessionService(id uint) error {
	// La validación de dependencias se realiza en la capa de repositorio.
	err := DeleteProfessionRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
