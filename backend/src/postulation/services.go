package postulation

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

var ErrPostulationExists = errors.New("candidate has already applied for this job")

func mapToResponseDTO(p schema.Postulation) PostulationResponseDTO {
	return PostulationResponseDTO{
		ID:                  p.ID,
		Active:              p.Active,
		CandidateID:         p.CandidateID,
		CandidateName:       p.Candidate.User.Name + " " + p.Candidate.LastName,
		CandidateEmail:      p.Candidate.User.Email,
		JobOfferPosition:    p.JobOffer.OpenPosition,
		JobOfferSalary:      p.JobOffer.Salary,
		JobOfferCompanyName: p.JobOffer.Company.Name,
		HasContract:         p.Contract != nil,
	}
}

func CreatePostulationService(dto PostulationCreateDTO) (PostulationResponseDTO, error) {
	exists, err := PostulationExistsRepository(dto.CandidateID, dto.JobID)

	if err != nil {
		return PostulationResponseDTO{}, err
	}
	if exists {
		return PostulationResponseDTO{}, ErrPostulationExists // Devolvemos el error definido localmente
	}

	newPostulation := schema.Postulation{
		CandidateID: dto.CandidateID,
		JobID:       dto.JobID,
		Active:      true,
	}

	if err := CreatePostulationRepository(&newPostulation); err != nil {
		return PostulationResponseDTO{}, err
	}

	created, err := GetPostulationByIDRepository(newPostulation.ID)
	if err != nil {
		return PostulationResponseDTO{}, err
	}

	return mapToResponseDTO(created), nil
}

// GetAllPostulationsService recupera todas las postulaciones.
func GetAllPostulationsService() ([]PostulationResponseDTO, error) {
	postulations, err := GetAllPostulationsRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []PostulationResponseDTO
	for _, p := range postulations {
		responseDTOs = append(responseDTOs, mapToResponseDTO(p))
	}
	return responseDTOs, nil
}

func GetPostulationByIDService(id uint) (PostulationResponseDTO, error) {
	p, err := GetPostulationByIDRepository(id)
	if err != nil {
		return PostulationResponseDTO{}, err // GORM manejará ErrRecordNotFound
	}
	return mapToResponseDTO(p), nil
}

func UpdatePostulationService(id uint, dto PostulationUpdateDTO) (PostulationResponseDTO, error) {
	updateData := map[string]interface{}{"active": *dto.Active}

	if err := UpdatePostulationRepository(id, updateData); err != nil {
		return PostulationResponseDTO{}, err
	}

	return GetPostulationByIDService(id)
}

func DeletePostulationService(id uint) error {
	err := DeletePostulationRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
