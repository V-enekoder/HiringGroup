package contract

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
)

var ErrContractExists = errors.New("a contract already exists for this postulation")

func mapToResponseDTO(c schema.Contract) ContractResponseDTO {
	return ContractResponseDTO{
		ID:               c.ID,
		Active:           c.Active,
		PostulationID:    c.PostulationID,
		PeriodName:       c.ContractingPeriod.Name,
		CandidateName:    c.Postulation.Candidate.User.Name + " " + c.Postulation.Candidate.LastName,
		CandidateEmail:   c.Postulation.Candidate.User.Email,
		JobOfferPosition: c.Postulation.JobOffer.OpenPosition,
		JobOfferSalary:   c.Postulation.JobOffer.Salary,
		CompanyName:      c.Postulation.JobOffer.Company.Name,
		PaymentsCount:    len(c.Payments),
	}
}

func CreateContractService(dto ContractCreateDTO) (ContractResponseDTO, error) {
	var postulation schema.Postulation
	if err := config.DB.First(&postulation, dto.PostulationID).Error; err != nil {
		return ContractResponseDTO{}, errors.New("postulation not found")
	}

	newContract := schema.Contract{
		PostulationID: dto.PostulationID,
		PeriodID:      dto.PeriodID,
		Active:        true,
	}

	if err := CreateContract(&newContract, postulation.CandidateID, postulation.ID, postulation.JobID); err != nil {
		return ContractResponseDTO{}, err
	}

	fullContract, err := GetContractByIDRepository(newContract.ID)
	if err != nil {
		return ContractResponseDTO{}, err
	}

	return mapToResponseDTO(fullContract), nil
}

func GetAllContractsService() ([]ContractResponseDTO, error) {
	contracts, err := GetAllContractsRepository()
	if err != nil {
		return nil, err
	}
	var responseDTOs []ContractResponseDTO
	for _, c := range contracts {
		responseDTOs = append(responseDTOs, mapToResponseDTO(c))
	}
	return responseDTOs, nil
}

func GetContractByIDService(id uint) (ContractResponseDTO, error) {
	c, err := GetContractByIDRepository(id)
	if err != nil {
		return ContractResponseDTO{}, err
	}
	return mapToResponseDTO(c), nil
}

func GetPaymentSummaryService(contractID uint) (PaymentSummaryDTO, error) {
	// Primero, verificamos si el contrato existe y obtenemos datos de contexto.
	contract, err := GetContractByIDRepository(contractID)
	if err != nil {
		// Si GORM no encuentra el registro, devuelve un error que propagamos.
		return PaymentSummaryDTO{}, errors.New("contract not found")
	}

	// Luego, llamamos al repositorio que hará la suma en la base de datos.
	summary, err := GetPaymentSummaryRepository(contractID)
	if err != nil {
		return PaymentSummaryDTO{}, err
	}

	// Completamos el DTO con la información de contexto que ya teníamos.
	summary.ContractID = contract.ID
	summary.CandidateName = contract.Postulation.Candidate.User.Name + " " + contract.Postulation.Candidate.LastName
	summary.CompanyName = contract.Postulation.JobOffer.Company.Name

	return summary, nil
}

func UpdateContractService(id uint, dto ContractUpdateDTO) (ContractResponseDTO, error) {
	updateData := make(map[string]interface{})
	if dto.PeriodID != nil {
		updateData["period_id"] = *dto.PeriodID
	}
	if dto.Active != nil {
		updateData["active"] = *dto.Active
	}

	if len(updateData) == 0 {
		return GetContractByIDService(id)
	}

	if err := UpdateContractRepository(id, updateData); err != nil {
		return ContractResponseDTO{}, err
	}

	return GetContractByIDService(id)
}
