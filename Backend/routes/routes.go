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
	alertService := services.NewAlertServiceImpl(database.Client.Database("pip").Collection("alertas"), database.Client.Database("pip").Collection("usuarios"))
	routeService := services.NewRouteServiceImpl(database.Client.Database("pip").Collection("route"))

	authHandler := handlers.NewAuthHandler(authService)
	routeHandler := handlers.NewRouteHandler(routeService)
	userHandler := handlers.NewUserHandler(userService)
	alertHandler := handlers.NewAlertHandler(alertService)

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	UserRouter(protected, userHandler)
	RouteRouter(protected, routeHandler)
	AlertRouter(protected, alertHandler)

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

func AlertRouter(router *gin.RouterGroup, alertHandler *handlers.AlertHandler) {
	alert := router.Group("/alert")
	alert.POST("", alertHandler.CreateAlert)
	alert.GET("", alertHandler.GetAlerts)
	alert.PUT("/:id", alertHandler.UpdateAlert)
	alert.DELETE("/:id", alertHandler.DeleteAlert)
}
