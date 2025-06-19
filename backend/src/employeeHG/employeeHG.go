package employeehg

// EmployeeHGCreateDTO define la estructura para crear un nuevo Empleado de Hiring Group.
// Incluye los campos del usuario que se creará simultáneamente.
type EmployeeHGCreateDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	RoleID   uint   `json:"role_id" binding:"required"` // Asumimos que el rol se especifica al crear
}

// EmployeeHGUpdateDTO define la estructura para actualizar los datos de un Empleado.
// Solo permitimos actualizar el nombre y el rol, ya que email/contraseña tienen un endpoint específico.
type EmployeeHGUpdateDTO struct {
	Name   string `json:"name" binding:"required"`
	RoleID uint   `json:"role_id" binding:"required"`
}

// EmployeeHGResponseDTO define la estructura de respuesta, aplanando los datos del usuario.
type EmployeeHGResponseDTO struct {
	ID     uint   `json:"id"`      // ID del EmployeeHG
	UserID uint   `json:"user_id"` // ID del User
	Name   string `json:"name"`
	Email  string `json:"email"`
	RoleID uint   `json:"role_id"`
}
