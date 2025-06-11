package role

import (
	"fmt"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"

	"gorm.io/gorm"
)

func RoleExistsByNameRepository(name string, excludeId uint) (bool, error) {
	db := config.DB
	var count int64
	query := db.Model(&schema.Role{}).Where("name = ?", name)
	if excludeId > 0 {
		query = query.Where("id != ?", excludeId)
	}
	if err := query.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// CreateRoleRepository crea un nuevo rol en la base de datos.
func CreateRoleRepository(role schema.Role) (schema.Role, error) {
	db := config.DB
	if err := db.Create(&role).Error; err != nil {
		return schema.Role{}, err
	}
	return role, nil
}

// GetAllRolesRepository obtiene todos los roles de la base de datos.
func GetAllRolesRepository() ([]schema.Role, error) {
	db := config.DB
	var roles []schema.Role
	if err := db.Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

// GetRoleByIdRepository obtiene un rol por su ID.
func GetRoleByIdRepository(id uint) (schema.Role, error) {
	db := config.DB
	var role schema.Role
	if err := db.First(&role, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return schema.Role{}, fmt.Errorf("role with id %d not found", id)
		}
		return schema.Role{}, err
	}
	return role, nil
}

// UpdateRoleRepository actualiza un rol existente en la base de datos.
func UpdateRoleRepository(role schema.Role) (schema.Role, error) {
	db := config.DB
	if err := db.Save(&role).Error; err != nil {
		return schema.Role{}, err
	}
	return role, nil
}

// DeleteRoleRepository elimina un rol de la base de datos por su ID.
func DeleteRoleRepository(id uint) error {
	db := config.DB
	if err := db.Delete(&schema.Role{}, id).Error; err != nil {
		return err
	}
	return nil
}
