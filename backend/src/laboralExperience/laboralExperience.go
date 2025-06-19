package laboralexperience

// LaboralExperienceCreateDTO define la estructura para crear una nueva experiencia laboral.
// Las fechas se reciben como strings para facilitar el binding.
type LaboralExperienceCreateDTO struct {
	CurriculumID uint   `json:"curriculum_id" binding:"required"`
	Company      string `json:"company" binding:"required"`
	JobTitle     string `json:"job_title" binding:"required"`
	Description  string `json:"description"`
	StartDate    string `json:"start_date" binding:"required"` // Formato "YYYY-MM-DD"
	EndDate      string `json:"end_date"`                      // Opcional, formato "YYYY-MM-DD"
}

// LaboralExperienceUpdateDTO define la estructura para actualizar una experiencia laboral.
// No se permite cambiar el CurriculumID.
type LaboralExperienceUpdateDTO struct {
	Company     string `json:"company" binding:"required"`
	JobTitle    string `json:"job_title" binding:"required"`
	Description string `json:"description"`
	StartDate   string `json:"start_date" binding:"required"` // Formato "YYYY-MM-DD"
	EndDate     string `json:"end_date"`                      // Opcional, formato "YYYY-MM-DD"
}

// LaboralExperienceResponseDTO define la estructura de respuesta.
type LaboralExperienceResponseDTO struct {
	ID           uint   `json:"id"`
	CurriculumID uint   `json:"curriculum_id"`
	Company      string `json:"company"`
	JobTitle     string `json:"job_title"`
	Description  string `json:"description"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date,omitempty"` // Omitir si está vacío
}
