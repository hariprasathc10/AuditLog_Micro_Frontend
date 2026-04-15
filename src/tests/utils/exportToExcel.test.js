import { describe, it, expect, vi } from 'vitest'
import { exportToExcel } from '../../utils/exportToExcel'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  write: vi.fn(() => new ArrayBuffer(8)),
}))


vi.mock('file-saver', () => ({ saveAs: vi.fn() }))


describe('exportToExcel utility', () => {


  it('calls saveAs with correct filename', () => {
    exportToExcel([{ Name: 'John', Role: 'ADMIN' }], 'TestFile', 'Sheet1')
    expect(saveAs).toHaveBeenCalled()
    const blob = saveAs.mock.calls[0][0]
    const name = saveAs.mock.calls[0][1]
    expect(name).toMatch(/TestFile/)
    expect(blob).toBeInstanceOf(Blob)
  })


  it('shows alert when data is empty', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    exportToExcel([], 'Empty')
    expect(alertMock).toHaveBeenCalledWith('No data to export.')
  })


  it('calls XLSX.utils.json_to_sheet with data', () => {
    const data = [{ Col1: 'A', Col2: 'B' }]
    exportToExcel(data, 'TestSheet', 'Sheet1')
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(data)
  })


})