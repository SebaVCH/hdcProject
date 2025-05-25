package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type CalendarEventService interface {
	GetAllCalendarEvents() ([]models.EventoCalendario, error)
	CreateCalendarEvent(event models.EventoCalendario) error
	DeleteCalendarEvent(id string) error
	UpdateCalendarEvent(updateData map[string]interface{}) (models.EventoCalendario, error)
}

type CalendarEventServiceImpl struct {
	CalendarEventCollection *mongo.Collection
}

func NewCalendarEventServiceImpl(calendarEventCollection *mongo.Collection) CalendarEventService {
	return &CalendarEventServiceImpl{
		CalendarEventCollection: calendarEventCollection,
	}
}

func (c CalendarEventServiceImpl) GetAllCalendarEvents() ([]models.EventoCalendario, error) {
	var events []models.EventoCalendario
	cursor, err := c.CalendarEventCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var event models.EventoCalendario
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

func (c CalendarEventServiceImpl) CreateCalendarEvent(event models.EventoCalendario) error {
	event.ID = bson.NewObjectID()
	_, err := c.CalendarEventCollection.InsertOne(context.Background(), event)
	return err
}

func (c CalendarEventServiceImpl) DeleteCalendarEvent(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de punto de ayuda inválido")
	}
	_, err = c.CalendarEventCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (c CalendarEventServiceImpl) UpdateCalendarEvent(updateData map[string]interface{}) (models.EventoCalendario, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return models.EventoCalendario{}, errors.New("ID de evento de calendario no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.EventoCalendario{}, errors.New("ID de evento de calendario inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = c.CalendarEventCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.EventoCalendario{}, err
	}

	var updatedEvent models.EventoCalendario
	err = c.CalendarEventCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedEvent)
	if err != nil {
		return models.EventoCalendario{}, err
	}
	return updatedEvent, nil
}
