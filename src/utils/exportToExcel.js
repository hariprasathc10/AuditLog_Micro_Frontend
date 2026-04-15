import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
 
export const exportToExcel = (data, fileName = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    alert('No data to export.')
    return
  }
 
  const worksheet  = XLSX.utils.json_to_sheet(data)
  const workbook   = XLSX.utils.book_new()
 
  // ✅ Auto column width
  const colWidths = Object.keys(data[0]).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key] ?? '').length)) + 2,
  }))
  worksheet['!cols'] = colWidths
 
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
 
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob        = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
 
  saveAs(blob, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}