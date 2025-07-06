package utils

import (
	"github.com/SebaVCH/hdcProject/internal/config"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func GenerateToken(userID string, userRol string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"user_role": userRol,
		"exp":       time.Now().Add(time.Hour * 2).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.JwtSecret
	return token.SignedString(jwtSecret)
}
