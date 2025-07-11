package domain

// LoginRequest representa el cuerpo de la petición para el login.
type LoginRequest struct {
	Email    string `json:"email" binding:"required" example:"usuario@ejemplo.com"`
	Password string `json:"password" binding:"required" example:"password123"`
}

// AuthResponse representa la respuesta exitosa del login/registro.
type AuthResponse struct {
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
}

// ErrorResponse representa una respuesta de error estándar de la API.
type ErrorResponse struct {
	Error string `json:"error" example:"Mensaje de error genérico"`
}
