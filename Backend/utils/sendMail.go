package utils

import (
	"backend/Backend/models"
	"bytes"
	"gopkg.in/gomail.v2"
	"html/template"
	"os"
	"strconv"
)

func SendMail(user models.Usuario, alert models.Alerta) error {

	HTMLLoad, err := template.ParseFiles("Backend/utils/mailTemplate.html")
	if err != nil {
		return err
	}

	data := struct {
		UserName string
		Alert    models.Alerta
	}{
		UserName: user.Name,
		Alert:    alert,
	}

	var body bytes.Buffer
	if err := HTMLLoad.Execute(&body, data); err != nil {
		return err
	}

	newMail := gomail.NewMessage()
	newMail.SetHeader("From", os.Getenv("EMAIL_FROM"))
	newMail.SetHeader("To", user.Email)
	newMail.SetHeader("Subject", "Alerta de ruta")
	newMail.SetBody("text/html", body.String())

	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return err
	}

	dialer := gomail.NewDialer(os.Getenv("SMTP_HOST"), port, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASS"))

	return dialer.DialAndSend(newMail)
}
