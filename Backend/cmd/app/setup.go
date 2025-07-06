package app

import (
	"github.com/SebaVCH/hdcProject/internal/config"
	"github.com/SebaVCH/hdcProject/internal/infrastructure/database"
	"github.com/SebaVCH/hdcProject/internal/interfaces/routes"
)

func StartBackend() error {

	if err := config.LoadEnv(); err != nil {
		return err
	}

	if err := database.StartDB(); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(":8080"); err != nil {
		return err
	}

	return nil
}
