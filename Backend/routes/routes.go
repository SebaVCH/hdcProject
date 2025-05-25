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
	calendarEventService := services.NewCalendarEventServiceImpl(database.Client.Database("pip").Collection("calendar_events"))
	exportDataService := services.NewExportDataServiceImpl(database.Client.Database("pip").Collection("people_helped"))

	authHandler := handlers.NewAuthHandler(authService)
	routeHandler := handlers.NewRouteHandler(routeService)
	userHandler := handlers.NewUserHandler(userService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	helpingPointHandler := handlers.NewHelpingPointHandler(helpingPointService)
	peopleHelpedHandler := handlers.NewPeopleHelpedHandler(peopleHelpedService)
	riskHandler := handlers.NewRiskHandler(riskService)
	calendarEventHandler := handlers.NewCalendarEventHandler(calendarEventService)
	exportDataHandler := handlers.NewExportDataHandler(exportDataService)

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
	CalendarEventRouter(protected, calendarEventHandler)
	ExportDataRouter(protected, exportDataHandler)

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
	notification := router.Group("/notification")
	notification.POST("", notificationHandler.CreateNotification)
	notification.GET("", notificationHandler.GetNotifications)
	notification.PUT("/:id", notificationHandler.UpdateNotification)
	notification.DELETE("/:id", notificationHandler.DeleteNotification)
}

func PeopleHelpedRouter(router *gin.RouterGroup, peoplehelpedHandler *handlers.PeopleHelpedHandler) {
	peoplehelped := router.Group("/people-helped")
	peoplehelped.POST("", peoplehelpedHandler.CreatePersonHelped)
	peoplehelped.GET("", peoplehelpedHandler.GetAllPeopleHelped)
	peoplehelped.PUT("/:id", peoplehelpedHandler.UpdatePersonHelped)
	peoplehelped.DELETE("/:id", peoplehelpedHandler.DeletePersonHelped)
}

func RiskRouter(router *gin.RouterGroup, riskHandler *handlers.RiskHandler) {
	risk := router.Group("/risk")
	risk.POST("", riskHandler.CreateRisk)
	risk.GET("", riskHandler.GetAllRisks)
	risk.PUT("/:id", riskHandler.UpdateRisk)
	risk.DELETE("/:id", riskHandler.DeleteRisk)
}

func HelpingPointRouter(router *gin.RouterGroup, helpingPointHandler *handlers.PuntoAyudaHandler) {
	helpingPoint := router.Group("/helping-point")
	helpingPoint.POST("", helpingPointHandler.CreateHelpingPoint)
	helpingPoint.GET("", helpingPointHandler.GetAllPoints)
	helpingPoint.PUT("/:id", helpingPointHandler.UpdateHelpingPoint)
	helpingPoint.DELETE("/:id", helpingPointHandler.DeleteHelpingPoint)
}

func CalendarEventRouter(router *gin.RouterGroup, calendarEventHandler *handlers.CalendarEventHandler) {
	calendarEvent := router.Group("/calendar-event")
	calendarEvent.POST("", calendarEventHandler.CreateCalendarEvent)
	calendarEvent.GET("", calendarEventHandler.GetAllCalendarEvents)
	calendarEvent.PUT("/:id", calendarEventHandler.UpdateCalendarEvent)
	calendarEvent.DELETE("/:id", calendarEventHandler.DeleteCalendarEvent)
}

func ExportDataRouter(router *gin.RouterGroup, exportDataHandler *handlers.ExportDataHandler) {
	exportData := router.Group("/export-data")
	exportData.GET("/people-helped", exportDataHandler.ExportPeopleHelped)
}
