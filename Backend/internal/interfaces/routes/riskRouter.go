package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupRiskRouter(r *gin.Engine) {

	riskRepo := repository.NewRiskRepository(database.Client.Database("pip").Collection("risks"))
	riskUseCase := usecase.NewRiskUseCase(riskRepo)
	riskController := controller.NewRiskController(riskUseCase)

	protected := r.Group("/risk")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", riskController.CreateRisk)
	protected.GET("", riskController.GetAllRisks)
	protected.PUT("/:id", riskController.UpdateRisk)
	protected.DELETE("/:id", riskController.DeleteRisk)
}
