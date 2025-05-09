package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RouteService interface {
	FindAll() ([]models.Route, error)
	FindById(routeId string) (models.Route, error)
	CreateRoute(route models.Route) (models.Route, error)
	UpdateRoute(route models.Route) (models.Route, error)
	DeleteRoute(routeId string) error
}

type RouteServiceImpl struct {
	RouteCollection *mongo.Collection
}

func NewRouteServiceImpl(routeCollection *mongo.Collection) RouteService {
	return &RouteServiceImpl{
		RouteCollection: routeCollection,
	}
}

func (r *RouteServiceImpl) FindAll() ([]models.Route, error) {
	cursor, err := r.RouteCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var routes []models.Route
	if err := cursor.All(context.Background(), &routes); err != nil {
		return nil, err
	}
	return routes, nil
}

func (r *RouteServiceImpl) FindById(routeId string) (models.Route, error) {
	objID, err := bson.ObjectIDFromHex(routeId)
	if err != nil {
		return models.Route{}, errors.New("ID de ruta inválido")
	}

	var route models.Route
	err = r.RouteCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&route)
	if err != nil {
		return models.Route{}, err
	}
	return route, nil
}

func (r *RouteServiceImpl) CreateRoute(route models.Route) (models.Route, error) {
	route.ID = bson.NewObjectID()
	_, err := r.RouteCollection.InsertOne(context.Background(), route)
	if err != nil {
		return models.Route{}, err
	}
	return route, nil
}

func (r *RouteServiceImpl) UpdateRoute(route models.Route) (models.Route, error) {
	if route.ID.IsZero() {
		return models.Route{}, errors.New("ID de ruta no proporcionado")
	}

	filter := bson.M{"_id": route.ID}
	update := bson.M{"$set": route}

	_, err := r.RouteCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return models.Route{}, err
	}

	var updatedRoute models.Route
	err = r.RouteCollection.FindOne(context.Background(), filter).Decode(&updatedRoute)
	if err != nil {
		return models.Route{}, err
	}
	return updatedRoute, nil
}

func (r *RouteServiceImpl) DeleteRoute(routeId string) error {
	objID, err := bson.ObjectIDFromHex(routeId)
	if err != nil {
		return errors.New("ID de ruta inválido")
	}

	_, err = r.RouteCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}