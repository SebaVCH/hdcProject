package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
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
