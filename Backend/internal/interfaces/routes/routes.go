package routes

import (
	"backend/Backend/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())
	SetupAuthRouter(r)
	SetupUserRouter(r)
	SetupRouteRouter(r)
	SetupRiskRouter(r)
	SetupHelpingPointRouter(r)
	SetupPeopleHelpedRouter(r)
	SetupNotificationRouter(r)
	SetupCalendarEventRouter(r)
	SetupExportDataRouter(r)
	return r
}
