package company

type CompanyCreateDTO struct {
	// User fields
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`

	// Company fields
	CompanyName string `json:"companyName" binding:"required"`
	Sector      string `json:"sector" binding:"required"`
	Address     string `json:"address" binding:"required"`
}

type CompanyUpdateDTO struct {
	// User field
	Name *string `json:"name"`

	// Company fields
	CompanyName *string `json:"companyName"`
	Sector      *string `json:"sector"`
	Address     *string `json:"address"`
}

type CompanyResponseDTO struct {
	ID          uint   `json:"company_id"`
	Role        string `json:"role"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	CompanyName string `json:"companyName"`
	Sector      string `json:"sector"`
	Address     string `json:"address"`
}
