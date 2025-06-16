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

func (n *notificationController) GetUnreadNotifications(c *gin.Context) {
	n.notificationUseCase.GetUnreadNotifications(c)
}

func (n *notificationController) GetReadNotifications(c *gin.Context) {
	n.notificationUseCase.GetReadNotifications(c)
}

func (n *notificationController) MarkNotificationAsRead(c *gin.Context) {
	n.notificationUseCase.MarkNotificationAsRead(c)
}
