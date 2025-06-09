package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupPeopleHelpedRouter(r *gin.Engine) {
	peopleHelpedRepo := repository.NewPeopleHelpedRepository(
		database.Client.Database("pip").Collection("helping_points"),
		database.Client.Database("pip").Collection("people_helped"),
	)
	peopleHelpedUseCase := usecase.NewPeopleHelpedUseCase(peopleHelpedRepo)
	peopleHelpedController := controller.NewPeopleHelpedController(peopleHelpedUseCase)

	protected := r.Group("/people-helped")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", peopleHelpedController.CreatePersonHelped)
	protected.GET("", peopleHelpedController.GetAllPeopleHelped)
	protected.PUT("/:id", peopleHelpedController.UpdatePersonHelped)
	protected.DELETE("/:id", peopleHelpedController.DeletePersonHelped)
}
