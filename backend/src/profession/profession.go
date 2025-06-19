package profession

// ProfessionCreateDTO define la estructura para crear una nueva profesión.
type ProfessionCreateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ProfessionUpdateDTO define la estructura para actualizar una profesión existente.
type ProfessionUpdateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ProfessionResponseDTO define la estructura de respuesta para una profesión.
// No incluimos las relaciones para mantener la respuesta simple.
type ProfessionResponseDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
