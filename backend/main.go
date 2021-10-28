package main

import (
	"github.com/SilpasertS/sa-64-example/controller"
	"github.com/SilpasertS/sa-64-example/entity"
	"github.com/SilpasertS/sa-64-example/middlewares"
	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// Cashier Routes
			protected.GET("/cashiers", controller.ListCashiers)
			protected.GET("/cashier/:id", controller.GetCashier)
			protected.PATCH("/cashiers", controller.UpdateCashier)
			protected.DELETE("/cashiers/:id", controller.DeleteCashier)

			// Bill Routes
			protected.GET("/bills", controller.ListBills)
			protected.GET("/bill/:id", controller.GetBill)
			protected.POST("/bills", controller.CreateBill)
			protected.PATCH("/bills", controller.UpdateBill)
			protected.DELETE("/bills/:id", controller.DeleteBill)

			// Method Routes
			protected.GET("/methods", controller.ListMethods)
			protected.GET("/method/:id", controller.GetMethod)
			protected.POST("/methods", controller.CreateMethod)
			protected.PATCH("/methods", controller.UpdateMethod)
			protected.DELETE("/methods/:id", controller.DeleteMethod)

			// Receipt Routes
			protected.GET("/receipts", controller.ListReceipts)
			protected.GET("/receipt/:id", controller.GetReceipt)
			protected.POST("/receipts", controller.CreateReceipt)
			protected.PATCH("/receipts", controller.UpdateReceipt)
			protected.DELETE("/receipt_s/:id", controller.DeleteReceipt)

		}
	}

	// User Routes
	r.POST("/cashiers", controller.CreateCashier)

	// Authentication Routes
	r.POST("/login", controller.Login)

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}