package bank

// BankCreateDTO define la estructura para crear un nuevo banco.
type BankCreateDTO struct {
	Name string `json:"name" binding:"required"`
}

// BankUpdateDTO define la estructura para actualizar un banco existente.
type BankUpdateDTO struct {
	Name string `json:"name" binding:"required"`
}

// BankResponseDTO define la estructura de respuesta para un banco.
// No incluimos la lista de candidatos para mantener la respuesta simple.
type BankResponseDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
