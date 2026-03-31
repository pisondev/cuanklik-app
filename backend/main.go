package main

import (
	"fmt"

	"github.com/webui-dev/go-webui/v2"
)

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

	fmt.Println("=====================================================")
	fmt.Println("successfully run server! open chrome manually:")
	fmt.Println("http://localhost:8080/frontend/index.html")
	fmt.Println("=====================================================")

	w.Show("frontend/index.html")
	webui.Wait()
}
