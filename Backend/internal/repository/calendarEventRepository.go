package repository

import (
	"backend/Backend/internal/domain"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type CalendarEventRepository interface {
	GetAllCalendarEvents() ([]domain.EventoCalendario, error)
	CreateCalendarEvent(event domain.EventoCalendario) error
	DeleteCalendarEvent(id string) error
	UpdateCalendarEvent(updateData map[string]interface{}) (domain.EventoCalendario, error)
	FindByIDAndUserID(id string, userID string) error
}

type calendarEventRepository struct {
	CalendarEventCollection *mongo.Collection
}

func NewCalendarEventRepository(calendarEventCollection *mongo.Collection) CalendarEventRepository {
	return &calendarEventRepository{
		CalendarEventCollection: calendarEventCollection,
	}
}

func (c calendarEventRepository) GetAllCalendarEvents() ([]domain.EventoCalendario, error) {
	var events []domain.EventoCalendario
	cursor, err := c.CalendarEventCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var event domain.EventoCalendario
		if err := cursor.Decode(&event); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func (c calendarEventRepository) CreateCalendarEvent(event domain.EventoCalendario) error {
	event.ID = bson.NewObjectID()
	_, err := c.CalendarEventCollection.InsertOne(context.Background(), event)
	return err
}

func (c calendarEventRepository) DeleteCalendarEvent(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de punto de ayuda inválido")
	}
	_, err = c.CalendarEventCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (c calendarEventRepository) UpdateCalendarEvent(updateData map[string]interface{}) (domain.EventoCalendario, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return domain.EventoCalendario{}, errors.New("ID de evento de calendario no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.EventoCalendario{}, errors.New("ID de evento de calendario inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = c.CalendarEventCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.EventoCalendario{}, err
	}

	var updatedEvent domain.EventoCalendario
	err = c.CalendarEventCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedEvent)
	if err != nil {
		return domain.EventoCalendario{}, err
	}
	return updatedEvent, nil
}

func (c calendarEventRepository) FindByIDAndUserID(id string, userID string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de evento de calendario inválido")
	}

	var event domain.EventoCalendario
	filter := bson.M{"_id": objID, "author_id": userID}
	err = c.CalendarEventCollection.FindOne(context.Background(), filter).Decode(&event)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("evento no encontrado o no autorizado")
		}
		return err
	}
	return nil
}
