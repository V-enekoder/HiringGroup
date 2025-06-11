package zone

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
)

// mapToZoneResponseDTO es una función auxiliar para convertir un schema.Zone a un ZoneResponseDTO.
func mapToZoneResponseDTO(zone schema.Zone) ZoneResponseDTO {
	return ZoneResponseDTO{
		ID:   zone.ID,
		Name: zone.Name,
	}
}

// CreateZoneService maneja la lógica para crear una nueva zona.
func CreateZoneService(dto ZoneCreateDTO) (ZoneResponseDTO, error) {
	// 1. Validar que el nombre de la zona no exista para evitar duplicados.
	if exists, err := ZoneExistsByNameRepository(dto.Name, 0); err != nil {
		return ZoneResponseDTO{}, err
	} else if exists {
		return ZoneResponseDTO{}, errors.New("zone with this name already exists")
	}

	// 2. Crear la entidad a partir del DTO.
	newZone := schema.Zone{
		Name: dto.Name,
	}

	// 3. Guardar en el repositorio.
	createdZone, err := CreateZoneRepository(newZone)
	if err != nil {
		return ZoneResponseDTO{}, err
	}

	// 4. Devolver el DTO de respuesta.
	return mapToZoneResponseDTO(createdZone), nil
}

// GetAllZonesService obtiene todas las zonas.
func GetAllZonesService() ([]ZoneResponseDTO, error) {
	zones, err := GetAllZonesRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []ZoneResponseDTO
	for _, zone := range zones {
		responseDTOs = append(responseDTOs, mapToZoneResponseDTO(zone))
	}

	return responseDTOs, nil
}

// GetZoneByIdService obtiene una zona por su ID.
func GetZoneByIdService(id uint) (ZoneResponseDTO, error) {
	zone, err := GetZoneByIdRepository(id)
	if err != nil {
		return ZoneResponseDTO{}, err
	}
	return mapToZoneResponseDTO(zone), nil
}

// UpdateZoneService actualiza una zona existente.
func UpdateZoneService(id uint, dto ZoneUpdateDTO) (ZoneResponseDTO, error) {
	// 1. Validar que el nuevo nombre no esté en uso por otra zona.
	if exists, err := ZoneExistsByNameRepository(dto.Name, id); err != nil {
		return ZoneResponseDTO{}, err
	} else if exists {
		return ZoneResponseDTO{}, errors.New("zone with this name already exists")
	}

	// 2. Obtener la zona actual para actualizarla.
	zoneToUpdate, err := GetZoneByIdRepository(id)
	if err != nil {
		return ZoneResponseDTO{}, err // Devuelve el error "not found" si no existe.
	}

	// 3. Actualizar campos.
	zoneToUpdate.Name = dto.Name

	// 4. Guardar en el repositorio.
	updatedZone, err := UpdateZoneRepository(zoneToUpdate)
	if err != nil {
		return ZoneResponseDTO{}, err
	}

	// 5. Devolver DTO de respuesta.
	return mapToZoneResponseDTO(updatedZone), nil
}

// DeleteZoneService elimina una zona.
func DeleteZoneService(id uint) error {
	// Opcional: Agregar lógica aquí. Por ejemplo, verificar que la zona no tenga JobOffers asociadas antes de borrarla.
	// Por ahora, simplemente llamamos al repositorio.
	return DeleteZoneRepository(id)
}
