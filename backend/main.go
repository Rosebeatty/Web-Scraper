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

	// c := cors.New(cors.Options{
	// 	AllowedOrigins:   []string{"http://localhost:3000", "https://localhost:3000"}, // All origins
	// 	AllowedMethods:   []string{"GET", "POST", "OPTIONS"},                          // Allowing only get, just an example
	// 	AllowCredentials: true,
	// 	AllowedHeaders:   []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	// })

	log.Println("listening on", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}

func ping(w http.ResponseWriter, r *http.Request) {
	log.Println("Ping")
	w.Write([]byte("ping"))
}
