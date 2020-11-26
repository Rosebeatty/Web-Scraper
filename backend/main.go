package main

import (
	"log"
	"net/http"

	"github.com/golang/web-scraper/pkg/routes"
	"github.com/rs/cors"
)

func main() {
	addr := ":8080"
	mux := http.NewServeMux()
	handler := cors.Default().Handler(mux)

	mux.HandleFunc("/search", routes.ScrapeURL)
	mux.HandleFunc("/ping", ping)

	log.Println("listening on", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}

func ping(w http.ResponseWriter, r *http.Request) {
	log.Println("Ping")
	w.Write([]byte("ping"))
}
