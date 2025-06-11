package zone

// ZoneCreateDTO se usa para crear una nueva zona.
// El 'binding:"required"' asegura que el campo 'name' no puede estar vacío en la solicitud JSON.
type ZoneCreateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ZoneUpdateDTO se usa para actualizar una zona existente.
type ZoneUpdateDTO struct {
	Name string `json:"name" binding:"required"`
}

// ZoneResponseDTO es la estructura que se devuelve al cliente.
// Incluye el ID para que el cliente pueda identificar el recurso.
type ZoneResponseDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
