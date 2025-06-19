package emergencycontact

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// Errores personalizados para la lógica de negocio.
var (
	ErrDocumentExists = errors.New("an emergency contact with this document already exists")
	ErrContactInUse   = errors.New("cannot delete emergency contact as it is linked to one or more contracts")
)

// mapToContactResponseDTO convierte un schema.EmergencyContact a un DTO de respuesta.
func mapToContactResponseDTO(c schema.EmergencyContact) EmergencyContactResponseDTO {
	return EmergencyContactResponseDTO{
		ID:          c.ID,
		Document:    c.Document,
		Name:        c.Name,
		LastName:    c.LastName,
		PhoneNumber: c.PhoneNumber,
	}
}

// CreateContactService maneja la creación de un nuevo contacto de emergencia.
func CreateContactService(dto EmergencyContactCreateDTO) (EmergencyContactResponseDTO, error) {
	exists, err := ContactExistsByDocumentRepository(dto.Document)
	if err != nil {
		return EmergencyContactResponseDTO{}, err
	}
	if exists {
		return EmergencyContactResponseDTO{}, ErrDocumentExists
	}

	newContact := schema.EmergencyContact{
		Document:    dto.Document,
		Name:        dto.Name,
		LastName:    dto.LastName,
		PhoneNumber: dto.PhoneNumber,
	}

	if err := CreateContactRepository(&newContact); err != nil {
		return EmergencyContactResponseDTO{}, err
	}

	return mapToContactResponseDTO(newContact), nil
}

// GetAllContactsService recupera todos los contactos de emergencia.
func GetAllContactsService() ([]EmergencyContactResponseDTO, error) {
	contacts, err := GetAllContactsRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []EmergencyContactResponseDTO
	for _, c := range contacts {
		responseDTOs = append(responseDTOs, mapToContactResponseDTO(c))
	}
	return responseDTOs, nil
}

// GetContactByIDService recupera un contacto por su ID.
func GetContactByIDService(id uint) (EmergencyContactResponseDTO, error) {
	contact, err := GetContactByIDRepository(id)
	if err != nil {
		return EmergencyContactResponseDTO{}, err
	}
	return mapToContactResponseDTO(contact), nil
}

// UpdateContactService maneja la actualización de un contacto de emergencia.
func UpdateContactService(id uint, dto EmergencyContactUpdateDTO) (EmergencyContactResponseDTO, error) {
	// Verificar que el nuevo documento no esté en uso por OTRO contacto.
	exists, err := DocumentExistsOnOtherContact(id, dto.Document)
	if err != nil {
		return EmergencyContactResponseDTO{}, err
	}
	if exists {
		return EmergencyContactResponseDTO{}, ErrDocumentExists
	}

	updateData := map[string]interface{}{
		"document":     dto.Document,
		"name":         dto.Name,
		"last_name":    dto.LastName,
		"phone_number": dto.PhoneNumber,
	}

	if err := UpdateContactRepository(id, updateData); err != nil {
		return EmergencyContactResponseDTO{}, err
	}

	return GetContactByIDService(id)
}

// DeleteContactService maneja la eliminación de un contacto de emergencia.
func DeleteContactService(id uint) error {
	// La validación de dependencias se realiza en el repositorio.
	err := DeleteContactRepository(id)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return nil
}
