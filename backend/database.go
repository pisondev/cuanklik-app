package main

import (
	"database/sql"
	_ "embed"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

//go:embed db/schema.sql
var schemaSQL string

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./cuanklik.db")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}

	_, err = DB.Exec(schemaSQL)
	if err != nil {
		log.Fatal("Failed to execute database schema:", err)
	}

	fmt.Println("SQLite database initialized successfully.")
}
