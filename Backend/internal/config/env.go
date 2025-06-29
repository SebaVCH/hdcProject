package config

import (
	"os"
)

var JwtSecret []byte

func LoadEnv() error {

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))

	return nil
}
