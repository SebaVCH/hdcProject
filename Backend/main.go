package main

import (
	"backend/Backend/app"
)

func main() {

	if err := app.StartBackend(); err != nil {
		panic(err)
	}

}
