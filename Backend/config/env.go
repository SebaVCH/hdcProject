package config

import (
	"github.com/joho/godotenv"
	"os"
)

var JwtSecret []byte

func LoadEnv() error {

	if err := godotenv.Load(".env"); err != nil {
		return err
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))

	return nil
}
