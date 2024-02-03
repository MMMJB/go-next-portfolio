package handler

import (
	"fmt"
	"net/http"
)

func Connect(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hi")
}