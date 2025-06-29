package middleware

import (
	"errors"
	"github.com/SebaVCH/hdcProject/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Se requiere autorización"})
			c.Abort()
			return
		}

		token, err := ValidateToken(authHeader)
		if err != nil {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		c.Set("user", claims)

		c.Next()
	}
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	if !strings.HasPrefix(tokenString, "Bearer ") {
		return nil, errors.New("formato de token no válido")
	}

	tokenString = tokenString[7:]

	claims := jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inesperado")
		}
		return config.JwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token inválido o expirado")
	}

	return token, nil
}
