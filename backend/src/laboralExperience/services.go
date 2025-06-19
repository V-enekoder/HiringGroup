package laboralexperience

import (
	"errors"
	"time"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

const timeLayout = "2006-01-02"

// Errores personalizados
var (
	ErrCurriculumNotFound = errors.New("the specified curriculum does not exist")
	ErrInvalidDateRange   = errors.New("start date must be before the end date")
	ErrInvalidDateFormat  = errors.New("invalid date format, please use YYYY-MM-DD")
)

// mapToExperienceResponseDTO convierte el modelo a un DTO de respuesta.
func mapToExperienceResponseDTO(le schema.LaboralExperience) LaboralExperienceResponseDTO {
	response := LaboralExperienceResponseDTO{
		ID:           le.ID,
		CurriculumID: le.CurriculumID,
		Company:      le.Company,
		JobTitle:     le.JobTitle,
		Description:  le.Description,
		StartDate:    le.Start.Format(timeLayout),
	}
	// Solo incluir la fecha de fin si no es el valor cero de time.Time
	if !le.End.IsZero() {
		response.EndDate = le.End.Format(timeLayout)
	}
	return response
}

// parseAndValidateDates es una función de utilidad para manejar la lógica de fechas.
func parseAndValidateDates(startDateStr, endDateStr string) (time.Time, time.Time, error) {
	startDate, err := time.Parse(timeLayout, startDateStr)
	if err != nil {
		return time.Time{}, time.Time{}, ErrInvalidDateFormat
	}

	var endDate time.Time
	if endDateStr != "" {
		endDate, err = time.Parse(timeLayout, endDateStr)
		if err != nil {
			return time.Time{}, time.Time{}, ErrInvalidDateFormat
		}
		if !startDate.Before(endDate) {
			return time.Time{}, time.Time{}, ErrInvalidDateRange
		}
	}
	return startDate, endDate, nil
}

// CreateExperienceService maneja la creación de una nueva experiencia laboral.
func CreateExperienceService(dto LaboralExperienceCreateDTO) (LaboralExperienceResponseDTO, error) {
	// 1. Validar que el currículum padre existe.
	if err := CheckCurriculumExistsRepository(dto.CurriculumID); err != nil {
		return LaboralExperienceResponseDTO{}, err
	}

	// 2. Parsear y validar fechas.
	startDate, endDate, err := parseAndValidateDates(dto.StartDate, dto.EndDate)
	if err != nil {
		return LaboralExperienceResponseDTO{}, err
	}

	newExperience := schema.LaboralExperience{
		CurriculumID: dto.CurriculumID,
		Company:      dto.Company,
		JobTitle:     dto.JobTitle,
		Description:  dto.Description,
		Start:        startDate,
		End:          endDate,
	}

	if err := CreateExperienceRepository(&newExperience); err != nil {
		return LaboralExperienceResponseDTO{}, err
	}

	return mapToExperienceResponseDTO(newExperience), nil
}

// GetAllExperiencesService recupera todas las experiencias laborales.
func GetAllExperiencesService() ([]LaboralExperienceResponseDTO, error) {
	experiences, err := GetAllExperiencesRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []LaboralExperienceResponseDTO
	for _, le := range experiences {
		responseDTOs = append(responseDTOs, mapToExperienceResponseDTO(le))
	}
	return responseDTOs, nil
}

// GetExperienceByIDService recupera una experiencia por su ID.
func GetExperienceByIDService(id uint) (LaboralExperienceResponseDTO, error) {
	le, err := GetExperienceByIDRepository(id)
	if err != nil {
		return LaboralExperienceResponseDTO{}, err
	}
	return mapToExperienceResponseDTO(le), nil
}

// UpdateExperienceService maneja la actualización de una experiencia.
func UpdateExperienceService(id uint, dto LaboralExperienceUpdateDTO) (LaboralExperienceResponseDTO, error) {
	startDate, endDate, err := parseAndValidateDates(dto.StartDate, dto.EndDate)
	if err != nil {
		return LaboralExperienceResponseDTO{}, err
	}

	updateData := map[string]interface{}{
		"company":     dto.Company,
		"job_title":   dto.JobTitle,
		"description": dto.Description,
		"start":       startDate,
		"end":         endDate,
	}

	if err := UpdateExperienceRepository(id, updateData); err != nil {
		return LaboralExperienceResponseDTO{}, err
	}

	return GetExperienceByIDService(id)
}

// DeleteExperienceService maneja la eliminación de una experiencia.
func DeleteExperienceService(id uint) error {
	err := DeleteExperienceRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
