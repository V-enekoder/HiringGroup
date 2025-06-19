package contractingperiod

// ContractingPeriodCreateDTO define la estructura para crear un nuevo período de contratación.
type ContractingPeriodCreateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ContractingPeriodUpdateDTO define la estructura para actualizar un período de contratación existente.
type ContractingPeriodUpdateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ContractingPeriodResponseDTO define la estructura de respuesta para un período de contratación.
// No incluimos la lista de contratos para mantener la respuesta simple y evitar cargas pesadas.
type ContractingPeriodResponseDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
