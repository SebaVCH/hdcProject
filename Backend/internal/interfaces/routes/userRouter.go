package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"

	"github.com/gin-gonic/gin"
)

func SetupUserRouter(r *gin.Engine) {

	userRepo := repository.NewUserRepository(database.Client.Database("pip").Collection("usuarios"))
	userUseCase := usecase.NewUserUseCase(userRepo)
	userController := controller.NewUserController(userUseCase)

	protected := r.Group("/user")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/profile", userController.GetUserProfile)
	protected.GET("/", middleware.RoleMiddleware("admin"), userController.GetAllUsers)
	protected.GET("/:id", middleware.RoleMiddleware("admin"), userController.GetUserByID)
	protected.PUT("/update", userController.UpdateUserInfo)
}
