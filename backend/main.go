package main

import (
	"net/http"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/role"
	"github.com/V-enekoder/HiringGroup/src/user"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	config.LoadEnv()
	config.ConnectDB()
	config.SyncDB()
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.SetTrustedProxies(nil)
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	user.RegisterRoutes(r)
	role.RegisterRoutes(r)

	r.Run()
}
