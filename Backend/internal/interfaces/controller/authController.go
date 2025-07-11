// Package controller contiene la lógica de controladores de la aplicación.
// Los controladores manejan las solicitudes HTTP para cada endpoint correspondiente y llaman a los casos de uso correspondientes.
// Este paquete es responsable de la interacción entre las rutas HTTP y la lógica de negocio de la aplicación.
package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

// authController es la estructura que implementa los controladores de autenticación.
// Contiene una instancia del caso de uso de autenticación para manejar las solicitudes de inicio de sesión y registro.
type authController struct {
	authUseCase usecase.AuthUseCase
}

// NewAuthController crea una nueva instancia de authController.
// Recibe un caso de uso de autenticación y devuelve un puntero a authController.
func NewAuthController(authUseCase usecase.AuthUseCase) *authController {
	return &authController{
		authUseCase: authUseCase,
	}
}

// Login maneja las solicitudes de inicio de sesión.
// @Summary Iniciar sesión de usuario
// @Description Valida a un usuario con su email y contraseña.
// @Tags Autenticación
// @Accept  json
// @Produce  json
// @Param   login  body  domain.LoginRequest  true  "Credenciales de Inicio de Sesión"
// @Success 200 {object} domain.AuthResponse  "Token de autenticación"
// @Failure 400 {object} domain.ErrorResponse "Error: Datos de entrada inválidos"
// @Failure 401 {object} domain.ErrorResponse "Error: Credenciales inválidas"
// @Router /login [post]
func (a *authController) Login(c *gin.Context) {
	a.authUseCase.Login(c)
}

func (a *authController) Register(c *gin.Context) {
	a.authUseCase.Register(c)
}
