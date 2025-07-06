package main

import (
	"github.com/SebaVCH/hdcProject/cmd/app"
)

func main() {

	if err := app.StartBackend(); err != nil {
		panic(err)
	}

}
