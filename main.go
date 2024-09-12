package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/burntcarrot/heaputil"
)

type recordPage struct {
	Records *[]heaputil.RecordData `json:"heapRecords"`
	Total   int                    `json:"total"`
	Cursor  int                    `json:"cursor"`
}

func main() {
	filePath := flag.String("file", "", "Path to the heap dump file")
	flag.Parse()

	if *filePath == "" {
		log.Fatal("Please provide the path to the heap dump file using the -file flag.")
	}

	file, err := os.Open(*filePath)
	if err != nil {
		log.Fatalf("Failed to open file: %v", err)
	}
	defer file.Close()

	reader := bufio.NewReader(file)

	graphContent, err := GenerateGraph(reader)
	if err != nil {
		log.Fatalf("Failed to generate graph: %v", err)
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		log.Fatalf("Failed to seek to starting point: %v", err)
	}
	reader.Reset(file)

	records, err := heaputil.ParseDump(reader)
	if err != nil {
		log.Fatalf("Failed to parse records: %v", err)
	}

	http.HandleFunc("/api/records", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		page := recordPage{
			Records: &records,
			Total:   len(records),
			Cursor:  0,
		}

		enc := json.NewEncoder(w)

		err := enc.Encode(page)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error writing response: %v", err), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/api/record-info", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		enc := json.NewEncoder(w)

		err := enc.Encode(map[string]any{"heapRecordTypes": GetUniqueRecordTypes(records)})
		if err != nil {
			http.Error(w, fmt.Sprintf("Error writing response: %v", err), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/api/graph", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		enc := json.NewEncoder(w)

		err := enc.Encode(graphContent)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error writing response: %v", err), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		html, err := GenerateHTML(records, graphContent)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error generating HTML: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html")

		_, err = io.WriteString(w, html)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error writing response: %v", err), http.StatusInternalServerError)
		}
	})

	port := ":8080"
	log.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
