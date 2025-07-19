package user

type UserResponseDTO struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UserCreateDTO struct {
	Name     string `form:"name" binding:"required"`
	Email    string `form:"email" binding:"required"`
	Password string `form:"password" binding:"required"`
}

type UserUpdateDTO struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UserUpdatePasswordDTO struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

// ANTERIORMENTE UserCreateDTO, ahora más específico para el registro.
// Acepta el RoleID y los campos necesarios para crear el perfil asociado.
type RegisterRequestDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	RoleID   uint   `json:"role_id" binding:"required"` // Ej: 3=Company, 4=Candidate

	// --- Campos específicos para el perfil de CANDIDATO ---
	LastName    string `json:"last_name"`
	Document    string `json:"document"`
	PhoneNumber string `json:"phone_number"`
	Address     string `json:"address"`
	BloodType   string `json:"blood_type"`
	BankID      *uint  `json:"bankId" binding:"required"`      // Nullable, puede ser nil
	BankAccount string `json:"bankAccount" binding:"required"` // Requerido para crear un candidato
}

// LoginRequestDTO define la estructura para la petición de login.
type LoginRequestDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponseDTO define la respuesta tras un login exitoso.
// Cumple con tu requisito de devolver el tipo de usuario y su ID.
type LoginResponseDTO struct {
	UserID    uint   `json:"user_id"`
	ProfileID uint   `json:"profile_id"` // ID del Candidate, Company, etc.
	Name      string `json:"name"`
	Email     string `json:"email"`
	Role      string `json:"role"` // Ej: "candidate", "company"
}
