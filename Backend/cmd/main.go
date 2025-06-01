package main

import (
	"backend/Backend/cmd/app"
)

func main() {

	if err := app.StartBackend(); err != nil {
		panic(err)
	}

}
