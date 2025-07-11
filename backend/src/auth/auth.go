package auth

// RegisterRequestDTO define la estructura para el registro de un nuevo usuario.
// Se incluye el RoleID para determinar qué tipo de perfil crear (Candidato, Empresa, etc.).
type RegisterRequestDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	RoleID   uint   `json:"role_id" binding:"required"` // Ej: 1=Admin, 2=Empleado, 3=Empresa, 4=Candidato

	// --- Campos específicos para el perfil de CANDIDATO ---
	LastName string `json:"last_name"`
	Document string `json:"document"`

	// --- Campos específicos para el perfil de EMPRESA ---
	CompanyName string `json:"company_name"`
	Sector      string `json:"sector"`
	Address     string `json:"address"`
}

// LoginRequestDTO define la estructura para la petición de login.
type LoginRequestDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponseDTO define la respuesta que se envía al usuario tras un login exitoso.
// Cumple con el requisito de devolver el ID y el tipo de usuario.
type LoginResponseDTO struct {
	UserID    uint   `json:"user_id"`
	ProfileID uint   `json:"profile_id"` // El ID del registro en la tabla Candidate, Company, etc.
	Name      string `json:"name"`
	Email     string `json:"email"`
	Role      string `json:"role"` // Ej: "candidate", "company", "admin"
}
