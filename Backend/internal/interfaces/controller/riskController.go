package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

type riskController struct {
	riskUseCase usecase.RiskUseCase
}

func NewRiskController(riskUseCase usecase.RiskUseCase) *riskController {
	return &riskController{
		riskUseCase: riskUseCase,
	}
}

func (r *riskController) GetAllRisks(c *gin.Context) {
	r.riskUseCase.GetAllRisks(c)
}

func (r *riskController) CreateRisk(c *gin.Context) {
	r.riskUseCase.CreateRisk(c)
}

func (r *riskController) DeleteRisk(c *gin.Context) {
	r.riskUseCase.DeleteRisk(c)
}

func (r *riskController) UpdateRisk(c *gin.Context) {
	r.riskUseCase.UpdateRisk(c)
}
