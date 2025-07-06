package routes

import (
	"github.com/SebaVCH/hdcProject/internal/infrastructure/database"
	"github.com/SebaVCH/hdcProject/internal/interfaces/controller"
	"github.com/SebaVCH/hdcProject/internal/interfaces/middleware"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupUserRouter(r *gin.Engine) {

	userRepo := repository.NewUserRepository(database.Client.Database("pip").Collection("usuarios"))
	userUseCase := usecase.NewUserUseCase(userRepo)
	userController := controller.NewUserController(userUseCase)

	protected := r.Group("/user")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/profile", userController.GetUserProfile)
	protected.GET("/name/:id", userController.GetNameByID)
	protected.GET("/", middleware.RoleMiddleware("admin"), userController.GetAllUsers)
	protected.GET("/:id", middleware.RoleMiddleware("admin"), userController.GetUserByID)
	protected.PUT("/update", userController.UpdateUserInfo)
}
