package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

type exportDataController struct {
	exportDataUseCase usecase.ExportDataUseCase
}

func NewExportDataController(exportDataUseCase usecase.ExportDataUseCase) *exportDataController {
	return &exportDataController{
		exportDataUseCase: exportDataUseCase,
	}
}

func (e *exportDataController) ExportPeopleHelped(c *gin.Context) {
	e.exportDataUseCase.ExportPeopleHelped(c)
}
