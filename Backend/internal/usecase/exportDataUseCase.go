package usecase

import (
	"fmt"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"net/http"
)

type ExportDataUseCase interface {
	ExportPeopleHelped(c *gin.Context)
}

type exportDataUseCase struct {
	exportDataRepository repository.ExportDataRepository
}

func NewExportDataUseCase(exportDataRepository repository.ExportDataRepository) ExportDataUseCase {
	return &exportDataUseCase{
		exportDataRepository: exportDataRepository,
	}
}

func (ed exportDataUseCase) ExportPeopleHelped(c *gin.Context) {
	peopleHelped, err := ed.exportDataRepository.GetPeopleHelpedData()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener datos"})
		return
	}

	f := excelize.NewFile()
	sheetName := "PeopleHelped"
	actualsheet, _ := f.NewSheet(sheetName)
	f.SetActiveSheet(actualsheet)
	f.DeleteSheet("Sheet1")

	headers := []string{"ID", "Nombre", "Genero", "Fecha de Registro"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
	}

	for i, person := range peopleHelped {
		row := i + 2
		f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), person.ID.Hex())
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), person.Age)
		f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), person.Gender)
		f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), person.DateRegister.Format("2006-01-02"))
	}

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", "attachment; filename=people_helped.xlsx")
	c.Header("Content-Transfer-Encoding", "binary")
	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error al generar el archivo Excel"})
	}
}
