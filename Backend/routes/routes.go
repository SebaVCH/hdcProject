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
	peopleHelpedService := services.NewPeopleHelpedServiceImpl(database.Client.Database("pip").Collection("people_helped"))
	riskService := services.NewRiskServiceImpl(database.Client.Database("pip").Collection("risks"))

	authHandler := handlers.NewAuthHandler(authService)
	routeHandler := handlers.NewRouteHandler(routeService)
	userHandler := handlers.NewUserHandler(userService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	helpingPointHandler := handlers.NewHelpingPointHandler(helpingPointService)
	peopleHelpedHandler := handlers.NewPeopleHelpedHandler(peopleHelpedService)
	riskHandler := handlers.NewRiskHandler(riskService)

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	UserRouter(protected, userHandler)
	RouteRouter(protected, routeHandler)
	NotificationRouter(protected, notificationHandler)
	HelpingPointRouter(protected, helpingPointHandler)
	PeopleHelpedRouter(protected, peopleHelpedHandler)
	RiskRouter(protected, riskHandler)

	return r
}

func RouteRouter(router *gin.RouterGroup, routeHandler *handlers.RouteHandler) {
	route := router.Group("/route")
	route.GET("", routeHandler.FindAll)
	route.GET("/:id", routeHandler.FindById)
	route.POST("", routeHandler.CreateRoute)
	route.PUT("/:id", routeHandler.UpdateRoute)
	route.DELETE("/:id", routeHandler.DeleteRoute)
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

func PeopleHelpedRouter(router *gin.RouterGroup, peoplehelpedHandler *handlers.PeopleHelpedHandler) {
	alert := router.Group("/people-helped")
	alert.POST("", peoplehelpedHandler.CreatePersonHelped)
	alert.GET("", peoplehelpedHandler.GetAllPeopleHelped)
	alert.PUT("/:id", peoplehelpedHandler.UpdatePersonHelped)
	alert.DELETE("/:id", peoplehelpedHandler.DeletePersonHelped)
}

func RiskRouter(router *gin.RouterGroup, riskHandler *handlers.RiskHandler) {
	alert := router.Group("/risk")
	alert.POST("", riskHandler.CreateRisk)
	alert.GET("", riskHandler.GetAllRisks)
	alert.PUT("/:id", riskHandler.UpdateRisk)
	alert.DELETE("/:id", riskHandler.DeleteRisk)
}

func HelpingPointRouter(router *gin.RouterGroup, helpingPointHandler *handlers.PuntoAyudaHandler) {
	helpingPoint := router.Group("/helping-point")
	helpingPoint.POST("", helpingPointHandler.CreateHelpingPoint)
	helpingPoint.GET("", helpingPointHandler.GetAllPoints)
	helpingPoint.PUT("/:id", helpingPointHandler.UpdateHelpingPoint)
	helpingPoint.DELETE("/:id", helpingPointHandler.DeleteHelpingPoint)
}
