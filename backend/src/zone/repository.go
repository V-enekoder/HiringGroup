package zone

import (
	"fmt"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"gorm.io/gorm"
)

// ZoneExistsByNameRepository verifica si una zona con un nombre específico ya existe.
// El 'excludeId' se usa para no considerar la propia zona al actualizar.
func ZoneExistsByNameRepository(name string, excludeId uint) (bool, error) {
	db := config.DB
	var count int64
	query := db.Model(&schema.Zone{}).Where("name = ?", name)
	if excludeId > 0 {
		query = query.Where("id != ?", excludeId)
	}
	if err := query.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// CreateZoneRepository crea una nueva zona en la base de datos.
func CreateZoneRepository(zone schema.Zone) (schema.Zone, error) {
	db := config.DB
	if err := db.Create(&zone).Error; err != nil {
		return schema.Zone{}, err
	}
	return zone, nil
}

// GetAllZonesRepository obtiene todas las zonas de la base de datos.
func GetAllZonesRepository() ([]schema.Zone, error) {
	db := config.DB
	var zones []schema.Zone
	if err := db.Find(&zones).Error; err != nil {
		return nil, err
	}
	return zones, nil
}

// GetZoneByIdRepository obtiene una zona por su ID.
func GetZoneByIdRepository(id uint) (schema.Zone, error) {
	db := config.DB
	var zone schema.Zone
	if err := db.First(&zone, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return schema.Zone{}, fmt.Errorf("zone with id %d not found", id)
		}
		return schema.Zone{}, err
	}
	return zone, nil
}

// UpdateZoneRepository actualiza una zona existente en la base de datos.
func UpdateZoneRepository(zone schema.Zone) (schema.Zone, error) {
	db := config.DB
	if err := db.Save(&zone).Error; err != nil {
		return schema.Zone{}, err
	}
	return zone, nil
}

// DeleteZoneRepository elimina una zona de la base de datos por su ID.
func DeleteZoneRepository(id uint) error {
	db := config.DB
	if err := db.Delete(&schema.Zone{}, id).Error; err != nil {
		return err
	}
	return nil
}
