package controller

import (
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type peopleHelpedController struct {
	peopleHelpedUseCase usecase.PeopleHelpedUseCase
}

func NewPeopleHelpedController(peopleHelpedUseCase usecase.PeopleHelpedUseCase) *peopleHelpedController {
	return &peopleHelpedController{
		peopleHelpedUseCase: peopleHelpedUseCase,
	}
}
func (p *peopleHelpedController) GetAllPeopleHelped(c *gin.Context) {
	p.peopleHelpedUseCase.GetAllPeopleHelped(c)
}

func (p *peopleHelpedController) CreatePersonHelped(c *gin.Context) {
	p.peopleHelpedUseCase.CreatePersonHelped(c)
}

func (p *peopleHelpedController) DeletePersonHelped(c *gin.Context) {
	p.peopleHelpedUseCase.DeletePersonHelped(c)
}

func (p *peopleHelpedController) UpdatePersonHelped(c *gin.Context) {
	p.peopleHelpedUseCase.UpdatePersonHelped(c)
}
