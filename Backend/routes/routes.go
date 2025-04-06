package routes

import (
	"backend/Backend/database"
	"backend/Backend/handlers"
	"backend/Backend/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	RouteRouter(r, handlers.NewRouteHandler(&services.RouteServiceImpl{RouteCollection: database.Client.Database("pip").Collection("route"), Validate: validator.New()}))

	//r.POST("/register", handler.)
	//r.POST("/login", handler.)

	protected := r.Group("/")
	protected.Use()

	return r

}

func RouteRouter(ginEngine *gin.Engine, routeHandler *handlers.RouteHandler) {
	router := ginEngine.Group("/route")

	router.GET("", routeHandler.FindAll)
	// continuar ....
}
