package app

import (
	"backend/Backend/internal/config"
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/routes"
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
