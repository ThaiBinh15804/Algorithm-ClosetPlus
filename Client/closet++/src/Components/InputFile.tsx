/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { FormDataRun } from "src/App"
import { ExcelData, MiningResult } from "src/type"
import * as XLSX from "xlsx"
import axios from "axios"

interface Props {
  setResponseResult: React.Dispatch<React.SetStateAction<MiningResult | null>>
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  excelData: ExcelData | null
  setExcelData: React.Dispatch<React.SetStateAction<ExcelData | null>>
}

export default function InputFile({ setResponseResult, file, setFile, excelData, setExcelData }: Props) {
  const refInput = useRef<HTMLInputElement>(null)

  const handleClickRef = () => {
    refInput.current?.click()
  }

  const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileChoose = event.target.files?.[0] as File
    if (fileChoose) {
      setFile(fileChoose)
      const data = await readExcelFiles(fileChoose)
      setExcelData(data)
    }
  }

  const readExcelFiles = async (file: File): Promise<ExcelData> => {
    const allTransactions: string[][] = []
    let minSup: number | undefined = 0
    let minConfidence: number | undefined = 0
    let minLift: number | undefined = 0

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)

    // Đọc sheet đầu tiên (dữ liệu giao dịch)
    const sheetName = workbook.SheetNames[0]
    const workSheet = workbook.Sheets[sheetName]
    const sheetData = XLSX.utils.sheet_to_json(workSheet, { header: 1 }) as any[][]

    const paramRow = sheetData[1] // Hàng 2 (chỉ số 1)
    minSup = Number(paramRow[1]) // Cột B (min_sup)
    minConfidence = Number(paramRow[2]) // Cột C (min_confidence)
    minLift = Number(paramRow[3]) // Cột D (min_lift)

    // Bỏ qua hàng tiêu đề (hàng 1: "Transaction") và đọc cột "Transaction"
    const transactions = sheetData.slice(1).map((row) => {
      const transactionString = row[0] // Cột A
      if (!transactionString || typeof transactionString !== "string") return []

      // Chuẩn hóa chuỗi giao dịch
      const normalizedString = transactionString.trim().replace(/\s*,\s*/g, ",")

      const splitItems = normalizedString
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== "")

      return splitItems
    })
    allTransactions.push(...transactions.filter((trans) => trans.length > 0))

    return {
      transactions: allTransactions,
      min_sup: minSup,
      min_confidence: minConfidence,
      min_lift: minLift
    }
  }

  const { handleSubmit: handleSubmitRunCloset2 } = useForm<FormDataRun>()

  const handleSubmitRunClosetPlusFile = handleSubmitRunCloset2(async () => {
    if (!file) {
      alert("Vui lòng chọn một file Excel trước khi chạy thuật toán!")
      return
    }

    try {
      const { transactions, min_sup, min_confidence, min_lift } = excelData || await readExcelFiles(file)
      if (!transactions || transactions.length === 0) {
        alert("Không có giao dịch hợp lệ trong file đã chọn!")
        return
      }
      if (!min_sup || !min_confidence || !min_lift) {
        alert("File thiếu thông tin tham số min_sup, min_confidence hoặc min_lift!")
        return
      }

      const body = { transactions, min_sup, min_confidence, min_lift }
      const res = await axios.post("http://localhost:8999/mine", body, {
        headers: { "Content-Type": "application/json" }
      })
      setResponseResult(res.data as MiningResult)
    } catch (error: any) {
      console.error("Lỗi:", error)
      alert("Có lỗi xảy ra khi xử lý file hoặc gửi dữ liệu: " + (error.message || "Không xác định"))
    }
  })

  return (
    <form onSubmit={handleSubmitRunClosetPlusFile} className="mt-2">
      <div className="mt-4 ">
        {/* Card chọn file */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mb-6 mx-auto">
          <div className="flex items-center gap-4 mt-4">
            <button
              className="py-2 px-5 bg-blue-600 rounded-md text-white text-base font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              type="button"
              onClick={handleClickRef}
            >
              <span className="text-xl">📁</span>
              Chọn file Excel
            </button>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".xlsx,.xls"
              ref={refInput}
              onClick={(event) => {
                ;(event.target as any).value = null
              }}
              onChange={handleChangeFile}
            />
            {file ? (
              <span className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded text-sm font-medium border border-green-200">
                <span className="text-lg">✔️</span>
                {file.name}
              </span>
            ) : (
              <span className="text-gray-400 text-sm italic">Chưa chọn file</span>
            )}
          </div>
          <div className="my-3">
            <div className="text-gray-500 text-sm">
              Chọn file Excel (.xlsx, .xls) chứa dữ liệu giao dịch và các tham số min_sup, min_confidence, min_lift.
            </div>
          </div>
          {file && (
            <div className="flex justify-end mt-6">
              <button
                className="py-2 px-5 bg-green-600 rounded-md text-white text-base font-semibold hover:bg-green-700 transition flex items-center gap-2"
                type="submit"
              >
                <span className="text-lg">🚀</span>
                Chạy thuật toán
              </button>
            </div>
          )}
        </div>

        {/* Hiển thị bảng dữ liệu và chỉ số nếu đọc file thành công */}
        {excelData && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto mt-4">
            <div className="mb-4">
              <div className="text-lg font-bold text-blue-700 mb-2">Thông số từ file</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="font-semibold text-blue-700">min_sup:</span> {excelData.min_sup}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">min_confidence:</span> {excelData.min_confidence}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">min_lift:</span> {excelData.min_lift}
                </div>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-700 mb-2">Danh sách giao dịch</div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="py-2 px-4 text-left text-sm font-semibold text-blue-700">TID</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-blue-700">Danh sách</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.transactions.map((trans, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 px-4 font-medium">T{idx + 1}</td>
                        <td className="py-2 px-4">{trans.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
