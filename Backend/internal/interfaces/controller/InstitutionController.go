package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

type InstitutionController struct {
	institutionUseCase usecase.InstitutionUseCase
}

func NewInstitutionController(institutionUseCase usecase.InstitutionUseCase) *InstitutionController {
	return &InstitutionController{
		institutionUseCase: institutionUseCase,
	}
}

func (i *InstitutionController) GetAllInstitutions(c *gin.Context) {
	i.institutionUseCase.GetAllInstitutions(c)
}

func (i *InstitutionController) GetInstitutionByID(c *gin.Context) {
	i.institutionUseCase.GetInstitutionByID(c)
}

func (i *InstitutionController) CreateInstitution(c *gin.Context) {
	i.institutionUseCase.CreateInstitution(c)
}

func (i *InstitutionController) UpdateInstitution(c *gin.Context) {
	i.institutionUseCase.UpdateInstitution(c)
}

func (i *InstitutionController) DeleteInstitution(c *gin.Context) {
	i.institutionUseCase.DeleteInstitution(c)
}
