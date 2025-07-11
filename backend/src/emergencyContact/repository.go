package emergencycontact

import (
	"log"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// CreateContactRepository crea un nuevo registro de contacto.
func CreateContactRepository(c *schema.EmergencyContact) error {
	db := config.DB
	log.Printf("Intentando crear contacto con ID: %d\n", c.ID)
	return db.Create(c).Error
}

// GetAllContactsRepository obtiene todos los contactos.
func GetAllContactsRepository() ([]schema.EmergencyContact, error) {
	var contacts []schema.EmergencyContact
	db := config.DB
	err := db.Find(&contacts).Error
	return contacts, err
}

func GetContactByCandidateIDRepository(candidateID uint) (schema.EmergencyContact, error) {
	var contact schema.EmergencyContact
	db := config.DB

	err := db.Where("candidate_id = ?", candidateID).First(&contact).Error

	return contact, err
}

func GetContactByIDRepository(id uint) (schema.EmergencyContact, error) {
	var contact schema.EmergencyContact
	db := config.DB
	err := db.First(&contact, id).Error
	return contact, err
}

// UpdateContactRepository actualiza los datos de un contacto.
func UpdateContactRepository(id uint, data map[string]interface{}) error {
	db := config.DB
	result := db.Model(&schema.EmergencyContact{}).Where("id = ?", id).Updates(data)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteContactRepository elimina un contacto, verificando primero que no tenga contratos asociados.
func DeleteContactRepository(id uint) error {
	db := config.DB
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar si el contacto está asociado a algún contrato.
		var count int64
		if err := tx.Model(&schema.Contract{}).Where("id = ?", id).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return ErrContactInUse // Error personalizado definido en el servicio
		}

		// 2. Si no hay dependencias, proceder con la eliminación.
		result := tx.Delete(&schema.EmergencyContact{}, id)
		if result.Error != nil {
			log.Printf("Error al eliminar contacto con ID %d: %v\n", id, result.Error)
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil // Commit
	})
}
