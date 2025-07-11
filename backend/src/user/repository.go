package user

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// --- NUEVA FUNCIÓN PARA EL REGISTRO TRANSACCIONAL ---
// Crea el registro de User y su perfil asociado (Candidate, Company, etc.)
// dentro de una transacción para garantizar la integridad de los datos.
func CreateUserAndProfileRepository(user *schema.User, profile interface{}) error {
	db := config.DB
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Crear el usuario principal
		if err := tx.Create(user).Error; err != nil {
			return fmt.Errorf("error creating user: %w", err)
		}

		// 2. Asignar el UserID al perfil y crearlo
		switch p := profile.(type) {
		case *schema.Candidate:
			p.UserID = user.ID
			if err := tx.Create(p).Error; err != nil {
				return fmt.Errorf("error creating candidate profile: %w", err)
			}
		case *schema.Company:
			p.UserID = user.ID
			if err := tx.Create(p).Error; err != nil {
				return fmt.Errorf("error creating company profile: %w", err)
			}
		// Puedes añadir casos para Admin y EmployeeHG aquí si lo necesitas
		default:
			return errors.New("unsupported profile type")
		}

		return nil // Si no hay errores, la transacción se confirma.
	})
}

// --- NUEVA FUNCIÓN PARA BUSCAR USUARIO POR EMAIL (PARA LOGIN) ---
func FindUserByEmailRepository(email string) (schema.User, error) {
	var user schema.User
	db := config.DB
	// Precargamos TODAS las relaciones de perfil para saber quién es el usuario.
	err := db.Preload("Role").Preload("Candidate").Preload("Company").Preload("Admin").Preload("EmployeeHG").Where("email = ?", email).First(&user).Error
	return user, err
}

func CreateUserRepository(user schema.User) (uint, error) {
	db := config.DB
	if err := db.Create(&user).Error; err != nil {
		return 0, err
	}
	return user.ID, nil
}

func GetUserByIdRepository(id uint) (schema.User, error) {
	db := config.DB
	var user schema.User

	err := db.Preload("Documents").Preload("Projects").Where("id = ?", id).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return schema.User{}, errors.New("record not found")
		}
		return schema.User{}, err
	}

	return user, nil
}

func GetPasswordUserRepository(id uint) (string, error) {
	db := config.DB
	var dbPassword string

	if err := db.Where("id = ?", id).First(&schema.User{}).Error; err != nil {
		return "", err
	}

	if err := db.Model(&schema.User{}).Where("id = ?", id).Pluck("password", &dbPassword).Error; err != nil {
		return "", err
	}
	return dbPassword, nil
}

func UserExistsByFieldRepository(field string, value interface{}, excludeId uint) (bool, error) {
	db := config.DB
	var count int64
	query := fmt.Sprintf("%s = ? AND id != ? ", field)
	if err := db.Model(&schema.User{}).Where(query, value, excludeId).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func UpdatePasswordUserRepository(id uint, newPassword string) error {
	db := config.DB
	if err := db.Model(&schema.User{}).Where("id = ?", id).Update("password", newPassword).Error; err != nil {
		return err
	}
	return nil
}

func UpdateUserRepository(id uint, userDTO UserUpdateDTO) error {
	db := config.DB

	user := schema.User{}

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}

	if userDTO.Name != "" {
		user.Name = userDTO.Name
	}
	if userDTO.Email != "" {
		user.Email = userDTO.Email
	}

	if err := db.Save(&user).Error; err != nil {
		return err
	}

	return nil
}

func DeleteUserbyIDRepository(id uint) error {
	db := config.DB
	var user schema.User

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}

	if err := db.Where("id = ?", id).Delete(&user).Error; err != nil {
		return err
	}

	return nil
}
