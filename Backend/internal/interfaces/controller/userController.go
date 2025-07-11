package controller

import (
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

type userController struct {
	userUseCase usecase.UserUseCase
}

func NewUserController(userUseCase usecase.UserUseCase) *userController {
	return &userController{
		userUseCase: userUseCase,
	}
}

func (u *userController) GetAllUsers(c *gin.Context) {
	u.userUseCase.GetAllUsers(c)
}

func (u *userController) UpdateUserInfo(c *gin.Context) {
	u.userUseCase.UpdateUserInfo(c)
}

func (u *userController) GetUserProfile(c *gin.Context) {
	u.userUseCase.GetUserProfile(c)
}

func (u *userController) GetUserByID(c *gin.Context) {
	u.userUseCase.GetUserByID(c)
}

func (u *userController) GetPublicInfoByID(c *gin.Context) {
	u.userUseCase.GetPublicInfoByID(c)
}
