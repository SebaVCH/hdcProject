package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type RouteUseCase interface {
	FindAll(c *gin.Context)
	FindByID(c *gin.Context)
	CreateRoute(c *gin.Context)
	UpdateRoute(c *gin.Context)
	DeleteRoute(c *gin.Context)
}

type routeUseCase struct {
	routeRepository repository.RouteRepository
}

func NewRouteUseCase(repo repository.RouteRepository) RouteUseCase {
	return &routeUseCase{routeRepository: repo}
}

func (r routeUseCase) FindAll(c *gin.Context) {
	routes, err := r.routeRepository.FindAll()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener rutas: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": routes})
}

func (r routeUseCase) FindByID(c *gin.Context) {
	id := c.Param("id")
	route, err := r.routeRepository.FindByID(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Ruta no encontrada"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": route})
}

func (r routeUseCase) CreateRoute(c *gin.Context) {
	var route domain.Route
	if err := c.ShouldBindJSON(&route); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	err := r.routeRepository.CreateRoute(&route)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"message": route})
}

func (r routeUseCase) UpdateRoute(c *gin.Context) {
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
	updatedRoute, err := r.routeRepository.UpdateRoute(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedRoute})
}

func (r routeUseCase) DeleteRoute(c *gin.Context) {
	id := c.Param("id")
	err := r.routeRepository.DeleteRoute(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar la ruta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Ruta eliminada correctamente"})
}
