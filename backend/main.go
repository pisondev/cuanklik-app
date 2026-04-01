package main

import (
	"embed"
	"fmt"
	"strings"

	"github.com/webui-dev/go-webui/v2"
)

//go:embed frontend
var frontendFS embed.FS

func main() {
	InitDB()

	w := webui.NewWindow()

	webui.Bind(w, "CalculateProfit", CalculateProfit)
	webui.Bind(w, "GetHistory", GetHistory)
	webui.Bind(w, "DeleteHistory", DeleteHistory)
	webui.Bind(w, "Register", HandleRegister)
	webui.Bind(w, "Login", HandleLogin)
	webui.Bind(w, "UpdateProfile", UpdateProfile)
	webui.Bind(w, "SaveHistory", SaveHistory)

	w.SetPort(8080)

	w.SetFileHandler(func(filename string) ([]byte, int) {
		if len(filename) > 0 && filename[0] == '/' {
			filename = filename[1:]
		}

		filepath := "frontend/" + filename
		data, err := frontendFS.ReadFile(filepath)

		if err != nil {
			notFound := []byte("HTTP/1.1 404 Not Found\r\n\r\n")
			return notFound, len(notFound)
		}

		contentType := "text/plain"
		if strings.HasSuffix(filename, ".html") {
			contentType = "text/html"
		} else if strings.HasSuffix(filename, ".css") {
			contentType = "text/css"
		} else if strings.HasSuffix(filename, ".js") {
			contentType = "application/javascript"
		}

		header := fmt.Sprintf("HTTP/1.1 200 OK\r\nContent-Type: %s\r\n\r\n", contentType)
		response := append([]byte(header), data...)

		return response, len(response)
	})

	fmt.Println("Running CuanKLIK Single Executable...")

	w.ShowBrowser("index.html", webui.Chrome)

	webui.Wait()
}
