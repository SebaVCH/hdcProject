package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type RouteHandler struct {
	RouteService services.RouteService
}

func NewRouteHandler(service services.RouteService) *RouteHandler {
	return &RouteHandler{RouteService: service}
}

func (h *RouteHandler) FindAll(c *gin.Context) {
	routes, err := h.RouteService.FindAll()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener rutas: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": routes})
}

func (h *RouteHandler) FindById(c *gin.Context) {
	id := c.Param("id")
	route, err := h.RouteService.FindById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Ruta no encontrada"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": route})
}

func (h *RouteHandler) CreateRoute(c *gin.Context) {
	var route models.Route
	if err := c.ShouldBindJSON(&route); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	err := h.RouteService.CreateRoute(route)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"message": route})
}

func (h *RouteHandler) UpdateRoute(c *gin.Context) {
	routeID := c.Param("id")
	if routeID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de ruta no proporcionado"})
		return
	}
	var updateData map[string]interface{}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = routeID
	updatedRoute, err := h.RouteService.UpdateRoute(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedRoute})
}

func (h *RouteHandler) DeleteRoute(c *gin.Context) {
	id := c.Param("id")
	err := h.RouteService.DeleteRoute(id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Ruta eliminada correctamente"})
}
