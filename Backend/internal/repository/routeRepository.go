package repository

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/utils"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type RouteRepository interface {
	FindAll() ([]domain.Route, error)
	FindByID(routeId string) (domain.Route, error)
	CreateRoute(route *domain.Route) error
	UpdateRoute(data map[string]interface{}) (domain.Route, error)
	DeleteRoute(routeId string) error
	FinishRoute(id string) error
	JoinRoute(code string, userID string) (domain.Route, error)
}

type routeRepository struct {
	RouteCollection *mongo.Collection
}

func NewRouteRepository(routeCollection *mongo.Collection) RouteRepository {
	return &routeRepository{
		RouteCollection: routeCollection,
	}
}

func (r *routeRepository) FindAll() ([]domain.Route, error) {
	cursor, err := r.RouteCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var routes []domain.Route
	if err := cursor.All(context.Background(), &routes); err != nil {
		return nil, err
	}
	return routes, nil
}

func (r *routeRepository) FindByID(routeId string) (domain.Route, error) {
	objID, err := bson.ObjectIDFromHex(routeId)
	if err != nil {
		return domain.Route{}, errors.New("ID de ruta inválido")
	}

	var route domain.Route
	err = r.RouteCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&route)
	if err != nil {
		return domain.Route{}, err
	}
	return route, nil
}

func (r *routeRepository) CreateRoute(route *domain.Route) error {
	route.ID = bson.NewObjectID()
	route.InviteCode = utils.NewInviteCode()
	if route.Team == nil {
		route.Team = []bson.ObjectID{}
	}
	_, err := r.RouteCollection.InsertOne(context.Background(), route)
	if err != nil {
		return err
	}
	return nil
}

func (r *routeRepository) UpdateRoute(data map[string]interface{}) (domain.Route, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return domain.Route{}, errors.New("ID de ruta no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.Route{}, errors.New("ID de ruta inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = r.RouteCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.Route{}, err
	}

	var updatedRoute domain.Route
	err = r.RouteCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedRoute)
	if err != nil {
		return domain.Route{}, err
	}
	return updatedRoute, nil
}

func (r *routeRepository) DeleteRoute(routeId string) error {
	objID, err := bson.ObjectIDFromHex(routeId)
	if err != nil {
		return errors.New("ID de ruta inválido")
	}

	_, err = r.RouteCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (r *routeRepository) FinishRoute(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de ruta inválido")
	}

	update := bson.M{"$set": bson.M{"status": "Finalizada", "date_finished": time.Now()}}
	_, err = r.RouteCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return err
	}

	return nil
}

func (r *routeRepository) JoinRoute(code string, userID string) (domain.Route, error) {
	var route domain.Route
	err := r.RouteCollection.FindOne(context.Background(), bson.M{"invite_code": code}).Decode(&route)
	if err != nil {
		return domain.Route{}, errors.New("Ruta no encontrada")
	}

	if route.Status == "Finalizada" {
		return domain.Route{}, errors.New("No puedes unirte a una ruta finalizada")
	}

	for _, member := range route.Team {
		if member.Hex() == userID {
			return domain.Route{}, errors.New("Ya eres parte de esta ruta")
		}
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return domain.Route{}, errors.New("ID de usuario inválido")
	}

	update := bson.M{"$push": bson.M{"team": userObjID}}
	_, err = r.RouteCollection.UpdateOne(context.Background(), bson.M{"_id": route.ID}, update)
	if err != nil {
		return domain.Route{}, err
	}

	err = r.RouteCollection.FindOne(context.Background(), bson.M{"_id": route.ID}).Decode(&route)
	if err != nil {
		return domain.Route{}, err
	}

	return route, nil
}
