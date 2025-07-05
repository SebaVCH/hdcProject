package routes

import (
	"github.com/SebaVCH/hdcProject/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
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
	SetupInstitutionRouter(r)
	return r
}
