package controller

import (
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type authController struct {
	authUseCase usecase.AuthUseCase
}

func NewAuthController(authUseCase usecase.AuthUseCase) *authController {
	return &authController{
		authUseCase: authUseCase,
	}
}

func (a *authController) Login(c *gin.Context) {
	a.authUseCase.Login(c)
}

func (a *authController) Register(c *gin.Context) {
	a.authUseCase.Register(c)
}
