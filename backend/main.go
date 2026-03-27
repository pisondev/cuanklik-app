package main

import (
	"fmt"

	"github.com/webui-dev/go-webui/v2"
)

func main() {
	InitDB()

	w := webui.NewWindow()

	fmt.Println("trying to start CuanKlik App...")
	w.ShowBrowser("frontend/index.html", webui.Chrome)

	webui.Wait()
}
