package routes

import (
	"backend/Backend/database"
	"backend/Backend/handlers"
	"backend/Backend/middleware"
	"backend/Backend/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	authService := services.NewAuthServiceImpl(database.Client.Database("pip").Collection("usuarios"))
	routeService := &services.RouteServiceImpl{
		RouteCollection: database.Client.Database("pip").Collection("route"),
		Validate:        validator.New(),
	}

	authHandler := handlers.NewAuthHandler(authService)
	routeHandler := handlers.NewRouteHandler(routeService)

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	RouteRouter(protected, routeHandler)

	return r
}

func RouteRouter(router *gin.RouterGroup, routeHandler *handlers.RouteHandler) {
	route := router.Group("/route")

	route.GET("", routeHandler.FindAll)
}
