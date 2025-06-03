package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
			return
		}

		userClaims, ok := claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			return
		}

		userRole, ok := userClaims["user_role"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Rol no encontrado"})
			return
		}

		for _, role := range allowedRoles {
			if userRole == role {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Acceso denegado"})
	}
}
