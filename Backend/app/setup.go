package app

import (
	"backend/Backend/config"
	"backend/Backend/database"
	"backend/Backend/routes"
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
