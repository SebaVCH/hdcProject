package config

import (
	"os"

	"github.com/joho/godotenv"
)

var JwtSecret []byte

func LoadEnv() error {

	if err := godotenv.Load("../.env"); err != nil {
		return err
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))

	return nil
}
