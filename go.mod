module github.com/pisondev/cuanklik-app

go 1.25.3

require (
	github.com/mattn/go-sqlite3 v1.14.37
	github.com/webui-dev/go-webui/v2 v2.5.2-0.20260324140909-b79ce073202b
)

require golang.org/x/crypto v0.49.0

replace github.com/webui-dev/go-webui/v2 => ./modules/go-webui/v2
