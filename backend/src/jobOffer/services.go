package jobOffer

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

func mapToResponseDTO(offer schema.JobOffer) JobOfferResponseDTO {
	return JobOfferResponseDTO{
		ID:             offer.ID,
		CompanyID:      offer.CompanyID,
		CompanyName:    offer.Company.Name,
		ProfessionName: offer.Profession.Name,
		ZoneName:       offer.Zone.Name, // Asume que Zone fue precargada
		Active:         offer.Active,
		Description:    offer.Description,
		OpenPosition:   offer.OpenPosition,
		Salary:         offer.Salary,
	}
}

func CreateJobOfferService(dto JobOfferCreateDTO) (JobOfferResponseDTO, error) {
	newJobOffer := schema.JobOffer{
		CompanyID:    dto.CompanyID,
		ProfessionID: dto.ProfessionID,
		ZoneID:       dto.ZoneID,
		Active:       true, // Por defecto, una nueva oferta está activa.
		Description:  dto.Description,
		OpenPosition: dto.OpenPosition,
		Salary:       dto.Salary,
	}

	if err := CreateJobOfferRepository(&newJobOffer); err != nil {
		return JobOfferResponseDTO{}, err
	}

	createdOffer, err := GetJobOfferByIDRepository(newJobOffer.ID)
	if err != nil {
		return JobOfferResponseDTO{}, err
	}

	return mapToResponseDTO(createdOffer), nil
}

func GetAllJobOffersService() ([]JobOfferResponseDTO, error) {
	jobOffers, err := GetAllJobOffersRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []JobOfferResponseDTO
	for _, offer := range jobOffers {
		responseDTOs = append(responseDTOs, mapToResponseDTO(offer))
	}
	return responseDTOs, nil
}

func GetAllActiveJobOffersService() ([]JobOfferResponseDTO, error) {
	jobOffers, err := GetAllActiveJobOffersRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []JobOfferResponseDTO
	for _, offer := range jobOffers {
		responseDTOs = append(responseDTOs, mapToResponseDTO(offer))
	}
	return responseDTOs, nil
}

func GetJobOfferByIDService(id uint) (JobOfferResponseDTO, error) {
	offer, err := GetJobOfferByIDRepository(id)
	if err != nil {
		return JobOfferResponseDTO{}, err
	}
	return mapToResponseDTO(offer), nil
}

func UpdateJobOfferService(id uint, dto JobOfferUpdateDTO) (JobOfferResponseDTO, error) {
	updateData := make(map[string]interface{})

	if dto.ProfessionID != nil {
		updateData["profession_id"] = *dto.ProfessionID
	}
	if dto.ZoneID != nil {
		updateData["zone_id"] = *dto.ZoneID
	}
	if dto.Active != nil {
		updateData["active"] = *dto.Active
	}
	if dto.Description != nil {
		updateData["description"] = *dto.Description
	}
	if dto.OpenPosition != nil {
		updateData["open_position"] = *dto.OpenPosition
	}
	if dto.Salary != nil {
		updateData["salary"] = *dto.Salary
	}

	if len(updateData) == 0 {
		return JobOfferResponseDTO{}, errors.New("no fields to update")
	}

	if err := UpdateJobOfferRepository(id, updateData); err != nil {
		return JobOfferResponseDTO{}, err
	}

	return GetJobOfferByIDService(id)
}

func DeleteJobOfferService(id uint) error {
	err := DeleteJobOfferRepository(id)
	// GORM manejará gorm.ErrRecordNotFound, que no es un error para una operación de borrado.
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
