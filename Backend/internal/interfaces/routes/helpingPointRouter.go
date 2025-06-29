package routes

import (
	"github.com/SebaVCH/hdcProject/internal/infrastructure/database"
	"github.com/SebaVCH/hdcProject/internal/interfaces/controller"
	"github.com/SebaVCH/hdcProject/internal/interfaces/middleware"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/usecase"

	"github.com/gin-gonic/gin"
)

func SetupHelpingPointRouter(r *gin.Engine) {
	helpPointRepo := repository.NewHelpPointRepository(
		database.Client.Database("pip").Collection("helping_points"),
		database.Client.Database("pip").Collection("people_helped"),
	)
	helpPointUseCase := usecase.NewHelpingPointUseCase(helpPointRepo)
	helpPointController := controller.NewHelpPointController(helpPointUseCase)

	protected := r.Group("/helping-point")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", helpPointController.CreateHelpingPoint)
	protected.GET("", helpPointController.GetAllPoints)
	protected.PUT("/:id", helpPointController.UpdateHelpingPoint)
	protected.DELETE("/:id", helpPointController.DeleteHelpingPoint)
}
