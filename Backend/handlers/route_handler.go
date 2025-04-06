package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RouteHandler struct {
	RouteService services.RouteService
}

func NewRouteHandler(service services.RouteService) *RouteHandler {
	return &RouteHandler{RouteService: service}
}

type ErrorResponse struct {
	Code    int
	Message string
}

type Response struct {
	Code   int
	Status string
	Data   []models.Route
}

func (h *RouteHandler) FindAll(ctx *gin.Context) {
	data, err := h.RouteService.FindAll()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := Response{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}
