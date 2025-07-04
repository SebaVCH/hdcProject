package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

type routeController struct {
	routeUseCase usecase.RouteUseCase
}

func NewRouteController(routeUseCase usecase.RouteUseCase) *routeController {
	return &routeController{
		routeUseCase: routeUseCase,
	}
}

func (r *routeController) FindAll(c *gin.Context) {
	r.routeUseCase.FindAll(c)
}

func (r *routeController) FindByID(c *gin.Context) {
	r.routeUseCase.FindByID(c)
}

func (r *routeController) CreateRoute(c *gin.Context) {
	r.routeUseCase.CreateRoute(c)
}

func (r *routeController) UpdateRoute(c *gin.Context) {
	r.routeUseCase.UpdateRoute(c)
}

func (r *routeController) DeleteRoute(c *gin.Context) {
	r.routeUseCase.DeleteRoute(c)
}

func (r *routeController) FinishRoute(c *gin.Context) {
	r.routeUseCase.FinishRoute(c)
}

func (r *routeController) JoinRoute(c *gin.Context) {
	r.routeUseCase.JoinRoute(c)
}

func (r *routeController) GetMyParticipation(c *gin.Context) {
	r.routeUseCase.GetMyParticipation(c)
}
