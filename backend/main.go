package main

import (
	"net/http"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/bank"
	"github.com/V-enekoder/HiringGroup/src/candidate"
	"github.com/V-enekoder/HiringGroup/src/company"
	"github.com/V-enekoder/HiringGroup/src/contract"
	contractingperiod "github.com/V-enekoder/HiringGroup/src/contractingPeriod"
	"github.com/V-enekoder/HiringGroup/src/curriculum"
	emergencycontact "github.com/V-enekoder/HiringGroup/src/emergencyContact"
	employeehg "github.com/V-enekoder/HiringGroup/src/employeeHG"
	"github.com/V-enekoder/HiringGroup/src/jobOffer"
	laboralexperience "github.com/V-enekoder/HiringGroup/src/laboralExperience"
	"github.com/V-enekoder/HiringGroup/src/payment"
	"github.com/V-enekoder/HiringGroup/src/postulation"
	"github.com/V-enekoder/HiringGroup/src/profession"
	"github.com/V-enekoder/HiringGroup/src/role"
	"github.com/V-enekoder/HiringGroup/src/user"
	"github.com/V-enekoder/HiringGroup/src/zone"
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

	bank.RegisterRoutes(r)
	candidate.RegisterRoutes(r)
	company.RegisterRoutes(r)
	contract.RegisterRoutes(r)
	contractingperiod.RegisterRoutes(r)
	curriculum.RegisterRoutes(r)
	emergencycontact.RegisterRoutes(r)
	employeehg.RegisterRoutes(r)
	jobOffer.RegisterRoutes(r)
	laboralexperience.RegisterRoutes(r)
	payment.RegisterRoutes(r)
	postulation.RegisterRoutes(r)
	profession.RegisterRoutes(r)
	role.RegisterRoutes(r)

	user.RegisterRoutes(r)
	zone.RegisterRoutes(r)

	r.Run()
}
