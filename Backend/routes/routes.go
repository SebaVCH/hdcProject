package routes

import (
	"backend/Backend/database"
	"backend/Backend/handlers"
	"backend/Backend/middleware"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	authService := services.NewAuthServiceImpl(database.Client.Database("pip").Collection("usuarios"))
	userService := services.NewUserServiceImpl(database.Client.Database("pip").Collection("usuarios"))
	notificationService := services.NewNotificationServiceImpl(database.Client.Database("pip").Collection("alertas"), database.Client.Database("pip").Collection("usuarios"))
	routeService := services.NewRouteServiceImpl(database.Client.Database("pip").Collection("route"))
	helpingPointService := services.NewHelpPointServiceImpl(database.Client.Database("pip").Collection("helping_points"))

	authHandler := handlers.NewAuthHandler(authService)
	routeHandler := handlers.NewRouteHandler(routeService)
	userHandler := handlers.NewUserHandler(userService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	helpingPointHandler := handlers.NewHelpingPointHandler(helpingPointService)

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	UserRouter(protected, userHandler)
	RouteRouter(protected, routeHandler)
	NotificationRouter(protected, notificationHandler)
	HelpingPointRouter(protected, helpingPointHandler)

	return r
}

func RouteRouter(router *gin.RouterGroup, routeHandler *handlers.RouteHandler) {
	route := router.Group("/route")
	route.GET("", routeHandler.FindAll)
}

func UserRouter(router *gin.RouterGroup, userHandler *handlers.UserHandler) {
	user := router.Group("/user")
	user.GET("/profile", userHandler.GetUserProfile)
	user.GET("/", userHandler.GetAllUsers)
	user.GET("/:id", userHandler.GetUserByID)
	user.PUT("/update", userHandler.UpdateUserInfo)
}

func NotificationRouter(router *gin.RouterGroup, notificationHandler *handlers.NotificationHandler) {
	alert := router.Group("/notification")
	alert.POST("", notificationHandler.CreateNotification)
	alert.GET("", notificationHandler.GetNotifications)
	alert.PUT("/:id", notificationHandler.UpdateNotification)
	alert.DELETE("/:id", notificationHandler.DeleteNotification)
}

func HelpingPointRouter(router *gin.RouterGroup, helpingPointHandler *handlers.PuntoAyudaHandler) {
	helpingPoint := router.Group("/helping-point")
	helpingPoint.POST("", helpingPointHandler.CreateHelpingPoint)
	helpingPoint.GET("", helpingPointHandler.GetAllPoints)
	helpingPoint.PUT("/:id", helpingPointHandler.UpdateHelpingPoint)
	helpingPoint.DELETE("/:id", helpingPointHandler.DeleteHelpingPoint)
}
