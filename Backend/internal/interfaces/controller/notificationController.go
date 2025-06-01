package controller

import (
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type notificationController struct {
	notificationUseCase usecase.NotificationUseCase
}

func NewNotificationController(notificationUseCase usecase.NotificationUseCase) *notificationController {
	return &notificationController{
		notificationUseCase: notificationUseCase,
	}
}

func (n *notificationController) CreateNotification(c *gin.Context) {
	n.notificationUseCase.CreateNotification(c)
}

func (n *notificationController) DeleteNotification(c *gin.Context) {
	n.notificationUseCase.DeleteNotification(c)
}

func (n *notificationController) UpdateNotification(c *gin.Context) {
	n.notificationUseCase.UpdateNotification(c)
}

func (n *notificationController) GetNotifications(c *gin.Context) {
	n.notificationUseCase.GetNotifications(c)
}
