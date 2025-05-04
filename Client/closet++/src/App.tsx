import { Pencil } from "lucide-react"
import { useState } from "react"
import { TypeSchemaFormDataRun } from "./rule"
import { ToastContainer } from "react-toastify"
import { MiningResult, TransactionType, ExcelData } from "./type"
import TreeNode from "./Components/Fptree"
import InputText from "./Components/InputText"
import InputFile from "./Components/InputFile"
import ExecutionStepItem from "./Components/Execution"

export type FormDataRun = Pick<TypeSchemaFormDataRun, "transactions" | "min_sup" | "min_lift" | "min_confidence">

function App() {
  const [typeInput, setTypeInput] = useState<"text" | "file">("text")
  const [listTransaction, setListTransaction] = useState<TransactionType[]>([])
  const [responseResult, setResponseResult] = useState<MiningResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [excelData, setExcelData] = useState<ExcelData | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#fff7ed] font-sans">
      <ToastContainer />
      <header className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] py-5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Thuật toán CLOSET++<span className="text-yellow-300">.</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="bg-white p-10 rounded-2xl shadow-2xl border-2 border-purple-100">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-transparent bg-clip-text drop-shadow">
            Tìm tập phổ biến đóng với CLOSET++
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow ${
                typeInput === "text"
                  ? "bg-gradient-to-r from-purple-200 to-purple-100 text-purple-800 ring-2 ring-purple-400"
                  : "text-gray-600 hover:bg-purple-50"
              }`}
              type="button"
              onClick={() => {
                setTypeInput("text")
                setResponseResult(null)
                setListTransaction([])
              }}
            >
              <Pencil size={18} />
              <span>Nhập thủ công</span>
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow ${
                typeInput === "file"
                  ? "bg-gradient-to-r from-orange-200 to-yellow-100 text-orange-800 ring-2 ring-orange-400"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
              type="button"
              onClick={() => {
                setTypeInput("file")
                setResponseResult(null)
                setListTransaction([])
              }}
            >
              <Pencil size={18} />
              <span>Nhập với excel</span>
            </button>
          </div>

          {typeInput === "text" && (
            <InputText
              listTransaction={listTransaction}
              setListTransaction={setListTransaction}
              setResponseResult={setResponseResult}
            />
          )}
          {typeInput === "file" && (
            <InputFile
              file={file}
              setFile={setFile}
              setResponseResult={setResponseResult}
              excelData={excelData}
              setExcelData={setExcelData}
            />
          )}
        </section>

        {responseResult && (
          <section className="mt-12">
            <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-transparent bg-clip-text drop-shadow-lg">
              Kết quả
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Frequent Itemsets */}
              <div className="bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100 p-8 rounded-2xl shadow-xl border-2 border-purple-200">
                <h3 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2">Tập hợp phổ biến</h3>
                <div className="space-y-3">
                  {responseResult &&
                    responseResult.frequent_itemsets.map((item, index) => (
                      <div
                        key={item.itemset}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border-l-4 border-purple-400"
                      >
                        <span className="text-purple-700 font-bold text-lg">{index + 1}.</span>
                        <span className="text-gray-900 text-lg">
                          <strong>{item.itemset}</strong>: {item.support}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Closed Itemsets */}
              <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-purple-100 p-8 rounded-2xl shadow-xl border-2 border-orange-200">
                <h3 className="text-2xl font-bold mb-6 text-orange-700 flex items-center gap-2">
                  Tập hợp phổ biến đóng
                </h3>
                <div className="space-y-3">
                  {responseResult &&
                    responseResult.closed_itemsets.map((item, index) => (
                      <div
                        key={item.itemset}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border-l-4 border-orange-400"
                      >
                        <span className="text-orange-700 font-bold text-lg">{index + 1}.</span>
                        <span className="text-gray-900 text-lg">
                          <strong>{item.itemset}</strong>: {item.support}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Association Rules */}
            <div className="bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100 p-8 rounded-2xl shadow-xl border-2 border-pink-200 mb-10">
              <h3 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2">Luật kết hợp</h3>
              <div className="space-y-3">
                {responseResult &&
                  responseResult.association_rules.map((item, index) => (
                    <div
                      key={item.rule}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border-l-4 border-pink-400"
                    >
                      <span className="text-pink-700 font-bold text-lg">{index + 1}.</span>
                      <span className="text-gray-900 text-lg">
                        <strong>{item.rule}</strong>
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* f_list */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-300">
                <h3 className="text-2xl font-bold mb-4 text-purple-700">Danh sách f_list</h3>
                <p className="text-gray-700">
                  Sắp xếp theo độ hỗ trợ giảm dần:{" "}
                  {responseResult?.f_list.map((item) => {
                    const findItemCount = responseResult.fp_tree.item_counts[item]
                    return (
                      <span key={item} className="inline-block mr-3">
                        <span className="font-bold text-purple-700">{item}</span>: {findItemCount}
                      </span>
                    )
                  })}
                </p>
              </div>

              {/* FP-tree Visualization */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-300">
                <h3 className="text-2xl font-bold mb-4 text-orange-700">Cây FP-tree</h3>
                <div className="w-full min-w-0">
                  {responseResult && <TreeNode node={responseResult.fp_tree.root} />}
                </div>
              </div>

              {/* Header Table */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-300">
                <h3 className="text-2xl font-bold mb-4 text-blue-700">Header Table</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Path
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responseResult &&
                        Object.entries(responseResult.fp_tree.header_table).map(([item, entries]) =>
                          entries.map((entry, idx) => (
                            <tr key={`${item}-${idx}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.path.join(" → ")}
                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Execution Steps */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-300">
                <h3 className="text-2xl font-bold mb-4 text-yellow-700">Các bước thực thi</h3>
                <div className="space-y-2">
                  {responseResult && responseResult.execution_steps.length > 0 ? (
                    responseResult.execution_steps.map((item, index) => (
                      <ExecutionStepItem
                        key={index}
                        step={item}
                        level={0}
                        // Truyền prop autoExpand nếu có sub_steps, ngược lại mặc định thu gọn
                        autoExpand={item.sub_steps && item.sub_steps.length > 0}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Không có dữ liệu để hiển thị.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
