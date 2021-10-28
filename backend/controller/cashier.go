package controller

import (
	"net/http"

	"github.com/SilpasertS/sa-64-example/entity"
	"github.com/gin-gonic/gin"
)

// GET /cashiers
// List all cashiers
func ListCashiers(c *gin.Context) {
	var cashiers []entity.Cashier
	if err := entity.DB().Raw("SELECT * FROM cashiers").Scan(&cashiers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cashiers})
}

// GET /cashier/:id
// Get cashier by id
func GetCashier(c *gin.Context) {
	var cashier entity.Cashier
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM cashiers WHERE id = ?", id).Scan(&cashier).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cashier})
}

// POST /cashiers
func CreateCashier(c *gin.Context) {
	var cashier entity.Cashier
	if err := c.ShouldBindJSON(&cashier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&cashier).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cashier})
}

// PATCH /cashiers
func UpdateCashier(c *gin.Context) {
	var cashier entity.Cashier
	if err := c.ShouldBindJSON(&cashier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", cashier.ID).First(&cashier); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cashier not found"})
		return
	}

	if err := entity.DB().Save(&cashier).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cashier})
}

// DELETE /cashiers/:id
func DeleteCashier(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM cashiers WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cashier not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.Cashier{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}