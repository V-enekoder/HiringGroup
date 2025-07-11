package auth

import (
	"errors"
	"fmt"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"

	"gorm.io/gorm"
)

func FindUserByEmail(email string) (schema.User, error) {
	var user schema.User
	db := config.DB
	err := db.Preload("Role").Preload("Candidate").Preload("Company").Preload("Admin").Preload("EmployeeHG").Where("email = ?", email).First(&user).Error
	return user, err
}

// CreateUserAndProfile crea el registro de User y su perfil asociado (Candidate, Company, etc.)
// dentro de una transacción para garantizar la integridad de los datos.
func CreateUserAndProfile(user *schema.User, profile interface{}) error {
	db := config.DB
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Crear el usuario principal
		if err := tx.Create(user).Error; err != nil {
			return fmt.Errorf("error creating user: %w", err)
		}

		// 2. Asignar el UserID al perfil y crearlo
		// Usamos un switch de tipo para manejar diferentes tipos de perfiles.
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
		// case *schema.Admin:
		// ...
		default:
			return errors.New("unsupported profile type")
		}

		// Si todo va bien, la transacción se confirma (commit).
		// Si hay un error, se revierte (rollback).
		return nil
	})
}
