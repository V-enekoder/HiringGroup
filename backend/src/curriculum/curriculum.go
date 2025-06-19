package curriculum

// LaboralExperienceResponseDTO es un sub-DTO para la respuesta del currículum.
// Asumimos su estructura aquí para mayor claridad.
type LaboralExperienceResponseDTO struct {
	ID          uint   `json:"id"`
	JobTitle    string `json:"job_title"`
	Company     string `json:"company"`
	Description string `json:"description"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date,omitempty"`
}

// CurriculumCreateDTO define la estructura para crear un nuevo currículum.
type CurriculumCreateDTO struct {
	CandidateID            uint   `json:"candidate_id" binding:"required"`
	ProfessionID           uint   `json:"profession_id" binding:"required"`
	Resume                 string `json:"resume"`
	UniversityOfGraduation string `json:"university_of_graduation" binding:"required"`
	Skills                 string `json:"skills"`
	SpokenLanguages        string `json:"spoken_languages"`
}

// CurriculumUpdateDTO define la estructura para actualizar un currículum.
type CurriculumUpdateDTO struct {
	// No permitimos cambiar el CandidateID de un currículum.
	ProfessionID           uint   `json:"profession_id" binding:"required"`
	Resume                 string `json:"resume"`
	UniversityOfGraduation string `json:"university_of_graduation" binding:"required"`
	Skills                 string `json:"skills"`
	SpokenLanguages        string `json:"spoken_languages"`
}

// CurriculumResponseDTO define la estructura de respuesta enriquecida.
type CurriculumResponseDTO struct {
	ID                     uint                           `json:"id"`
	CandidateID            uint                           `json:"candidate_id"`
	CandidateName          string                         `json:"candidate_name"` // Dato enriquecido
	ProfessionID           uint                           `json:"profession_id"`
	ProfessionName         string                         `json:"profession_name"` // Dato enriquecido
	Resume                 string                         `json:"resume"`
	UniversityOfGraduation string                         `json:"university_of_graduation"`
	Skills                 string                         `json:"skills"`
	SpokenLanguages        string                         `json:"spoken_languages"`
	LaboralExperiences     []LaboralExperienceResponseDTO `json:"laboral_experiences"` // Relación anidada
}
