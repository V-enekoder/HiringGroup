package role

type RoleCreateDTO struct {
	Name string `json:"name" binding:"required"`
}

// RoleUpdateDTO se usa para actualizar un rol existente.
type RoleUpdateDTO struct {
	Name string `json:"name" binding:"required"`
}

// RoleResponseDTO es la estructura que se devuelve al cliente.
type RoleResponseDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
