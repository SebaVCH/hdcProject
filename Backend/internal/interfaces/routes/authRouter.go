package routes

import (
	"github.com/SebaVCH/hdcProject/internal/infrastructure/database"
	"github.com/SebaVCH/hdcProject/internal/interfaces/controller"
	"github.com/SebaVCH/hdcProject/internal/interfaces/middleware"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupAuthRouter(r *gin.Engine) {

	authRepo := repository.NewAuthRepository(database.Client.Database("pip").Collection("usuarios"))
	authUseCase := usecase.NewAuthUseCase(authRepo)
	authController := controller.NewAuthController(authUseCase)

	r.POST("/register", authController.Register)
	r.POST("/login", authController.Login)
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
}
