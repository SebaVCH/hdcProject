package services

import (
	"backend/Backend/models"
	"errors"
	"time"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RouteService interface {
	FindAll() ([]models.Route, error)
	FindById(routeId string) (models.Route, error)
	CreateRoute(route models.Route) (models.Route, error)
	UpdateRoute(route models.Route) (models.Route, error)
	DeleteRoute(routeId models.Route) error
}

type RouteServiceImpl struct {
	RouteCollection *mongo.Collection
	Validate        *validator.Validate
}

func NewRouteServiceImpl(routeCollection *mongo.Collection, validate *validator.Validate) (service RouteService, err error) {
	if validate == nil {
		return nil, errors.New("validator cannot be nil")
	}
	return &RouteServiceImpl{
		RouteCollection: routeCollection,
		Validate:        validate,
	}, nil

}

// FindAll implements RouteService.
func (r *RouteServiceImpl) FindAll() (routes []models.Route, err error) {

	routes = append(routes,
		models.Route{
			Description: "unimplemented",
			RouteLeader: bson.NewObjectID(),
			Team:        []bson.ObjectID{},
			HelpPoints:  []models.PuntoAyuda{},
			Status:      "unimplemented",
			DateCreated: time.Time{},
			Alert:       bson.NewObjectID(),
		})
	return routes, nil
}

// FindById implements RouteService.
func (r *RouteServiceImpl) FindById(routeId string) (models.Route, error) {
	panic("unimplemented")
}

// CreateRoute implements RouteService.
func (r *RouteServiceImpl) CreateRoute(route models.Route) (models.Route, error) {
	panic("unimplemented")
}

// DeleteRoute implements RouteService.
func (r *RouteServiceImpl) DeleteRoute(routeId models.Route) error {
	panic("unimplemented")
}

// UpdateRoute implements RouteService.
func (r *RouteServiceImpl) UpdateRoute(route models.Route) (models.Route, error) {
	panic("unimplemented")
}
