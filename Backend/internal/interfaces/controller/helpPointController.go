package controller

import (
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type helpPointController struct {
	helpPointUseCase usecase.HelpingPointUseCase
}

func NewHelpPointController(helpPointUseCase usecase.HelpingPointUseCase) *helpPointController {
	return &helpPointController{
		helpPointUseCase: helpPointUseCase,
	}
}

func (h *helpPointController) GetAllPoints(c *gin.Context) {
	h.helpPointUseCase.GetAllPoints(c)
}
func (h *helpPointController) CreateHelpingPoint(c *gin.Context) {
	h.helpPointUseCase.CreateHelpingPoint(c)
}
func (h *helpPointController) UpdateHelpingPoint(c *gin.Context) {
	h.helpPointUseCase.UpdateHelpingPoint(c)
}

func (h *helpPointController) DeleteHelpingPoint(c *gin.Context) {
	h.helpPointUseCase.DeleteHelpingPoint(c)
}
