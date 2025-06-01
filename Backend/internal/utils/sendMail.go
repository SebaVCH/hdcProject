package utils

import (
	"backend/Backend/internal/domain"
	"bytes"
	"gopkg.in/gomail.v2"
	"html/template"
	"os"
	"strconv"
)

func SendNotificationMail(user domain.Usuario, notification domain.Aviso) error {

	HTMLLoad, err := template.ParseFiles("Backend/utils/Template_Notification.html")
	if err != nil {
		return err
	}

	data := struct {
		UserName string
		Aviso    domain.Aviso
	}{
		UserName: user.Name,
		Aviso:    notification,
	}

	var body bytes.Buffer
	if err := HTMLLoad.Execute(&body, data); err != nil {
		return err
	}

	newMail := gomail.NewMessage()
	newMail.SetHeader("From", os.Getenv("EMAIL_FROM"))
	newMail.SetHeader("To", user.Email)
	newMail.SetHeader("Subject", "Aviso de ruta")
	newMail.SetBody("text/html", body.String())

	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return err
	}

	dialer := gomail.NewDialer(os.Getenv("SMTP_HOST"), port, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASS"))

	return dialer.DialAndSend(newMail)
}
func SendRegistrationMail(user domain.Usuario, unhashedPass string) error {

	HTMLLoad, err := template.ParseFiles("utils/Template_Registration.html")
	if err != nil {
		return err
	}

	data := struct {
		UserName string
		Password string
	}{
		UserName: user.Name,
		Password: unhashedPass,
	}

	var body bytes.Buffer
	if err := HTMLLoad.Execute(&body, data); err != nil {
		return err
	}

	newMail := gomail.NewMessage()
	newMail.SetHeader("From", os.Getenv("EMAIL_FROM"))
	newMail.SetHeader("To", user.Email)
	newMail.SetHeader("Subject", "Registro completo!")
	newMail.SetBody("text/html", body.String())

	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return err
	}

	dialer := gomail.NewDialer(os.Getenv("SMTP_HOST"), port, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASS"))

	print("Aca en sendMail")
	print(dialer.DialAndSend(newMail))

	return dialer.DialAndSend(newMail)
}
