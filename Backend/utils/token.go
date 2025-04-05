package utils

import (
	"backend/Backend/config"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func GenerateToken() (string, error) {

	claims := jwt.MapClaims{
		//"mailPersona": ,
		"exp": time.Now().Add(time.Hour * 2).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.JwtSecret

	return token.SignedString(jwtSecret)

}
