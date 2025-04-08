package utils

import (
	"backend/Backend/config"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func GenerateToken(userID string, roles []string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"roles":   roles,
		"exp":     time.Now().Add(time.Hour * 2).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.JwtSecret
	return token.SignedString(jwtSecret)
}
