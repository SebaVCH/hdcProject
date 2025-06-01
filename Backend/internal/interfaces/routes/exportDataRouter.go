package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupExportDataRouter(r *gin.Engine) {

	exportDataRepo := repository.NewExportDataRepository(database.Client.Database("pip").Collection("people_helped"))
	exportDataUseCase := usecase.NewExportDataUseCase(exportDataRepo)
	exportDataController := controller.NewExportDataController(exportDataUseCase)

	protected := r.Group("/export-data")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/people-helped", exportDataController.ExportPeopleHelped)
}
