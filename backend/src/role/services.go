package role

import (
	"errors"

	"github.com/V-enekoder/HiringGroup/src/schema"
)

func CreateRoleService(dto RoleCreateDTO) (RoleResponseDTO, error) {
	// 1. Validar que el nombre del rol no exista
	if exists, err := RoleExistsByNameRepository(dto.Name, 0); err != nil {
		return RoleResponseDTO{}, err
	} else if exists {
		return RoleResponseDTO{}, errors.New("role with this name already exists")
	}

	// 2. Crear la entidad
	newRole := schema.Role{
		Name: dto.Name,
	}

	// 3. Guardar en el repositorio
	createdRole, err := CreateRoleRepository(newRole)
	if err != nil {
		return RoleResponseDTO{}, err
	}

	// 4. Devolver el DTO de respuesta
	return mapToRoleResponseDTO(createdRole), nil
}
func mapToRoleResponseDTO(role schema.Role) RoleResponseDTO {
	return RoleResponseDTO{
		ID:   role.ID,
		Name: role.Name,
	}
}

// GetAllRolesService obtiene todos los roles.
func GetAllRolesService() ([]RoleResponseDTO, error) {
	roles, err := GetAllRolesRepository()
	if err != nil {
		return nil, err
	}

	var responseDTOs []RoleResponseDTO
	for _, role := range roles {
		responseDTOs = append(responseDTOs, mapToRoleResponseDTO(role))
	}

	return responseDTOs, nil
}

// GetRoleByIdService obtiene un rol por su ID.
func GetRoleByIdService(id uint) (RoleResponseDTO, error) {
	role, err := GetRoleByIdRepository(id)
	if err != nil {
		return RoleResponseDTO{}, err
	}
	return mapToRoleResponseDTO(role), nil
}

// UpdateRoleService actualiza un rol existente.
func UpdateRoleService(id uint, dto RoleUpdateDTO) (RoleResponseDTO, error) {
	// 1. Validar que el nuevo nombre no esté en uso por otro rol
	if exists, err := RoleExistsByNameRepository(dto.Name, id); err != nil {
		return RoleResponseDTO{}, err
	} else if exists {
		return RoleResponseDTO{}, errors.New("role with this name already exists")
	}

	// 2. Obtener el rol actual
	roleToUpdate, err := GetRoleByIdRepository(id)
	if err != nil {
		return RoleResponseDTO{}, err
	}

	// 3. Actualizar campos
	roleToUpdate.Name = dto.Name

	// 4. Guardar en el repositorio
	updatedRole, err := UpdateRoleRepository(roleToUpdate)
	if err != nil {
		return RoleResponseDTO{}, err
	}

	// 5. Devolver DTO de respuesta
	return mapToRoleResponseDTO(updatedRole), nil
}

// DeleteRoleService elimina un rol.
func DeleteRoleService(id uint) error {
	// Opcional: Agregar lógica de negocio aquí. Por ejemplo, no permitir borrar un rol si tiene usuarios asignados.
	// Por ahora, simplemente llamamos al repositorio.
	return DeleteRoleRepository(id)
}
