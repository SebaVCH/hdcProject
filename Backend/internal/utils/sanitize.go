package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"regexp"
)

func IsValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,}$`)
	return re.MatchString(email)
}

func IsValidString(str string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9\s\-\_\.\,\@]+$`)
	return re.MatchString(str)
}

func IsValidPhone(phone string) bool {
	re := regexp.MustCompile(`^\+{0,1}[0-9]+$`)
	return re.MatchString(phone)
}

func SanitizeStringFields(c *gin.Context, updateData map[string]interface{}) bool {
	for key, value := range updateData {
		strVal, ok := value.(string)
		if ok {
			if !IsValidString(strVal) {
				c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Hay caracteres inválidos"})
				return false
			}
			updateData[key] = strVal
		}
	}
	return true
}
