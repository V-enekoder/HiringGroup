package curriculum

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Errores personalizados para la lógica de negocio.
var (
	ErrCandidateNotFound      = errors.New("candidate not found")
	ErrProfessionNotFound     = errors.New("profession not found")
	ErrCandidateHasCurriculum = errors.New("this candidate already has a curriculum")
)

// mapToCurriculumResponseDTO convierte el modelo de GORM a un DTO de respuesta.
func mapToCurriculumResponseDTO(cv schema.Curriculum) CurriculumResponseDTO {

	expDTOs := []LaboralExperienceResponseDTO{}
	for _, exp := range cv.LaboralExperiences {
		expDTOs = append(expDTOs, LaboralExperienceResponseDTO{
			ID:          exp.ID,
			JobTitle:    exp.JobTitle,
			Company:     exp.Company,
			Description: exp.Description,
			StartDate:   exp.StartDate.Format("2006-01-02"),
			EndDate:     exp.EndDate.Format("2006-01-02"),
		})
	}

	return CurriculumResponseDTO{
		ID:                     cv.ID,
		CandidateID:            cv.CandidateID,
		CandidateName:          cv.Candidate.User.Name + " " + cv.Candidate.LastName, // Acceso a través de las relaciones
		ProfessionName:         cv.Profession.Name,                                   // Acceso a través de las relaciones
		Resume:                 cv.Resume,
		UniversityOfGraduation: cv.UniversityOfGraduation,
		Skills:                 cv.Skills,
		SpokenLanguages:        cv.SpokenLanguages,
		LaboralExperiences:     expDTOs,
	}
}

// CreateCurriculumService maneja la creación de un nuevo currículum.
func CreateCurriculumService(dto CurriculumCreateDTO) (CurriculumResponseDTO, error) {
	// Validaciones de negocio
	if err := CheckCandidateExists(dto.CandidateID); err != nil {
		return CurriculumResponseDTO{}, err
	}
	if err := CheckProfessionExists(dto.ProfessionID); err != nil {
		return CurriculumResponseDTO{}, err
	}
	if err := CheckCandidateHasCurriculum(dto.CandidateID); err != nil {
		return CurriculumResponseDTO{}, err
	}

	newCV := schema.Curriculum{
		CandidateID:            dto.CandidateID,
		ProfessionID:           dto.ProfessionID,
		Resume:                 dto.Resume,
		UniversityOfGraduation: dto.UniversityOfGraduation,
		Skills:                 dto.Skills,
		SpokenLanguages:        dto.SpokenLanguages,
	}

	if err := CreateCurriculumRepository(&newCV); err != nil {
		return CurriculumResponseDTO{}, err
	}

	// Recuperar el CV recién creado con sus relaciones para la respuesta
	return GetCurriculumByIDService(newCV.ID)
}

// GetAllCurriculumsService recupera todos los currículums.
func GetAllCurriculumsService() ([]CurriculumResponseDTO, error) {
	cvs, err := GetAllCurriculumsRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []CurriculumResponseDTO
	for _, cv := range cvs {
		// Llamamos a Get para obtener las relaciones completas
		fullCV, err := GetCurriculumByIDService(cv.ID)
		if err != nil {
			return nil, err // O manejar el error de forma más granular
		}
		responseDTOs = append(responseDTOs, fullCV)
	}
	return responseDTOs, nil
}

// GetCurriculumByIDService recupera un currículum por ID.
func GetCurriculumByIDService(id uint) (CurriculumResponseDTO, error) {
	cv, err := GetCurriculumByIDRepository(id)
	if err != nil {
		return CurriculumResponseDTO{}, err
	}
	return mapToCurriculumResponseDTO(cv), nil
}

func GetCurriculumByCandidateIDService(id uint) (CurriculumResponseDTO, error) {
	cv, err := GetCurriculumByCandidateIDRepository(id)
	if err != nil {
		return CurriculumResponseDTO{}, err
	}
	return mapToCurriculumResponseDTO(cv), nil
}

// UpdateCurriculumService maneja la actualización de un currículum.
func UpdateCurriculumService(id uint, dto CurriculumUpdateDTO) (CurriculumResponseDTO, error) {
	// Validar que la profesión a la que se cambia existe.
	if err := CheckProfessionExists(dto.ProfessionID); err != nil {
		return CurriculumResponseDTO{}, err
	}

	updateData := map[string]interface{}{
		"profession_id":            dto.ProfessionID,
		"resume":                   dto.Resume,
		"university_of_graduation": dto.UniversityOfGraduation,
		"skills":                   dto.Skills,
		"spoken_languages":         dto.SpokenLanguages,
	}

	if err := UpdateCurriculumRepository(id, updateData); err != nil {
		return CurriculumResponseDTO{}, err
	}

	return GetCurriculumByIDService(id)
}

// DeleteCurriculumService maneja la eliminación de un currículum y sus dependencias.
func DeleteCurriculumService(id uint) error {
	err := DeleteCurriculumRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
