package routes

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {

	r := gin.Default()
	//r.POST("/register", handler.)
	//r.POST("/login", handler.)

	protected := r.Group("/")
	protected.Use()

	return r

}
