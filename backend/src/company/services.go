package company

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"github.com/V-enekoder/HiringGroup/src/user"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreateCompanyService(dto CompanyCreateDTO) (CompanyResponseDTO, error) {
	if exists, err := user.UserExistsByFieldService("email", dto.Email, 0); err != nil {
		return CompanyResponseDTO{}, err
	} else if exists {
		return CompanyResponseDTO{}, user.HandleUniquenessError("email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return CompanyResponseDTO{}, errors.New("error hashing password")
	}

	newUser := schema.User{
		Name:     dto.Name,
		Email:    dto.Email,
		Password: string(hashedPassword),
		RoleID:   3,
	}
	newCompany := schema.Company{
		Name:    dto.CompanyName,
		Sector:  dto.Sector,
		Address: dto.Address,
	}

	db := config.DB
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return CompanyResponseDTO{}, err
	}

	if err := CreateCompanyRepository(tx, &newUser, &newCompany); err != nil {
		tx.Rollback()
		return CompanyResponseDTO{}, fmt.Errorf("could not create company: %w", err)
	}

	if err := tx.Commit().Error; err != nil {
		return CompanyResponseDTO{}, err
	}

	tx.Preload("Role").First(&newUser, newUser.ID)

	response := CompanyResponseDTO{
		ID:          newCompany.ID,
		Role:        newUser.Role.Name,
		Name:        newUser.Name,
		Email:       newUser.Email,
		CompanyName: newCompany.Name,
		Sector:      newCompany.Sector,
		Address:     newCompany.Address,
	}

	return response, nil
}

func GetAllCompaniesService() ([]CompanyResponseDTO, error) {
	companies, err := GetAllCompaniesRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []CompanyResponseDTO
	for _, c := range companies {
		responseDTOs = append(responseDTOs, CompanyResponseDTO{
			ID:          c.ID,
			Role:        c.User.Role.Name,
			Name:        c.User.Name,
			Email:       c.User.Email,
			CompanyName: c.Name,
			Sector:      c.Sector,
			Address:     c.Address,
		})
	}
	return responseDTOs, nil
}

func GetCompanyByIDService(id uint) (CompanyResponseDTO, error) {
	c, err := GetCompanyByIDRepository(id)
	if err != nil {
		return CompanyResponseDTO{}, err
	}

	return CompanyResponseDTO{
		ID:          c.ID,
		Role:        c.User.Role.Name,
		Name:        c.User.Name,
		Email:       c.User.Email,
		CompanyName: c.Name,
		Sector:      c.Sector,
		Address:     c.Address,
	}, nil
}

func UpdateCompanyService(id uint, dto CompanyUpdateDTO) (CompanyResponseDTO, error) {
	existingCompany, err := GetCompanyByIDRepository(id)
	if err != nil {
		return CompanyResponseDTO{}, errors.New("company not found")
	}

	userToUpdate := schema.User{ID: existingCompany.UserID}
	if dto.Name != nil {
		userToUpdate.Name = *dto.Name
	}

	companyToUpdate := schema.Company{ID: id}
	if dto.CompanyName != nil {
		companyToUpdate.Name = *dto.CompanyName
	}
	if dto.Sector != nil {
		companyToUpdate.Sector = *dto.Sector
	}
	if dto.Address != nil {
		companyToUpdate.Address = *dto.Address
	}

	db := config.DB
	tx := db.Begin()
	if err := UpdateCompanyRepository(tx, &companyToUpdate, &userToUpdate); err != nil {
		tx.Rollback()
		return CompanyResponseDTO{}, err
	}
	tx.Commit()

	return GetCompanyByIDService(id)
}

func DeleteCompanyService(id uint) error {
	company, err := GetCompanyByIDRepository(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil // Se considera exitoso si ya no existe.
		}
		return err
	}

	db := config.DB
	tx := db.Begin()
	if err := DeleteCompanyRepository(tx, id, company.UserID); err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}
