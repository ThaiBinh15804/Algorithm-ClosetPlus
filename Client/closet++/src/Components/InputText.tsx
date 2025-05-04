import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Plus, Trash } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormDataRun } from "src/App"
import { schemaFormData, TypeSchemaFormData } from "src/rule"
import { MiningResult, TransactionType } from "src/type"

const formData = schemaFormData.pick(["numberTransaction", "min_sup", "min_confidence", "min_lift"])

type FormData = Pick<TypeSchemaFormData, "numberTransaction" | "min_sup" | "min_lift" | "min_confidence">

interface Props {
  listTransaction: TransactionType[]
  setListTransaction: React.Dispatch<React.SetStateAction<TransactionType[]>>
  setResponseResult: React.Dispatch<React.SetStateAction<MiningResult | null>>
}

export default function InputText({ listTransaction, setListTransaction, setResponseResult }: Props) {
  const [inputMinSup, setInputMinSup] = useState<number>()
  const [inputMinConfidence, setInputMinConfidence] = useState<number>()
  const [inputMinLift, setInputMinLift] = useState<number>()

  const { handleSubmit, register } = useForm<FormData>({ resolver: yupResolver(formData) })
  const handleSubmitForm = handleSubmit(
    (data) => {
      const n = Number(data.numberTransaction)
      const arr = Array.from({ length: n }, (_, i) => i + 1)
      const listTrans = arr.map((item) => ({
        id: "T" + item,
        listItem: ""
      }))
      setInputMinSup(parseFloat(data.min_sup))
      setInputMinConfidence(parseFloat(data.min_confidence))
      setInputMinLift(parseFloat(data.min_lift))
      setListTransaction(listTrans)
    },
    (errors) => {
      if (errors.numberTransaction) toast.error(errors.numberTransaction.message, { autoClose: 1500 })
      if (errors.min_sup) toast.error(errors.min_sup.message, { autoClose: 1500 })
      if (errors.min_confidence) toast.error(errors.min_confidence.message, { autoClose: 1500 })
      if (errors.min_lift) toast.error(errors.min_lift.message, { autoClose: 1500 })
    }
  )

  const handleChangeList = (idTransaction: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedList = listTransaction.map((item) =>
      item.id === idTransaction ? { ...item, listItem: event.target.value } : item
    )
    setListTransaction(updatedList)
  }

  const handleAddTransaction = () => {
    const listTransactionNew = [...listTransaction]
    const lengthCurrent = listTransactionNew.length + 1
    listTransactionNew.push({ id: "T" + lengthCurrent, listItem: "" })
    setListTransaction(listTransactionNew)
  }

  const handleDeleteItem = (idItem: string) => {
    const listTransactionNew = listTransaction.filter((item) => item.id !== idItem)
    setListTransaction(listTransactionNew)
  }

  const { handleSubmit: handleSubmitRunCloset } = useForm<FormDataRun>()
  const handleSubmitRunClosetPlus = handleSubmitRunCloset(async () => {
    const getItemFromTransaction = listTransaction.map((item) => {
      const normalizedString = item.listItem.trim().replace(/\s*,\s*/g, ",")
      const splitItem = normalizedString
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== "")
      return splitItem
    })
    const body = {
      transactions: getItemFromTransaction,
      min_sup: inputMinSup,
      min_confidence: inputMinConfidence,
      min_lift: inputMinLift
    }

    try {
      const res = await axios.post("http://localhost:8999/mine", body, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      setResponseResult(res.data as MiningResult)
    } catch (error: any) {
      console.error(error)
    }
  })

  return (
    <div className="mt-4">
      {/* Card nhập tham số */}
      <form onSubmit={handleSubmitForm} className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Số lượng giao dịch:</span>
            <input
              placeholder="Nhập số giao dịch"
              className="p-2 border border-gray-300 rounded-md min-w-[220px] text-[14px] focus:ring-2 focus:ring-blue-200"
              {...register("numberTransaction")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Ngưỡng hỗ trợ tối thiểu:</span>
            <input
              placeholder="Nhập ngưỡng hỗ trợ tối thiểu"
              className="p-2 border border-gray-300 rounded-md min-w-[220px] text-[14px] focus:ring-2 focus:ring-blue-200"
              {...register("min_sup")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Ngưỡng độ tin cậy tối thiểu:</span>
            <input
              placeholder="Nhập ngưỡng độ tin cậy tối thiểu"
              className="p-2 border border-gray-300 rounded-md min-w-[220px] text-[14px] focus:ring-2 focus:ring-blue-200"
              {...register("min_confidence")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Ngưỡng độ nâng tối thiểu:</span>
            <input
              placeholder="Nhập ngưỡng độ nâng tối thiểu"
              className="p-2 border border-gray-300 rounded-md min-w-[220px] text-[14px] focus:ring-2 focus:ring-blue-200"
              {...register("min_lift")}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 w-full py-2 px-4 bg-blue-500 rounded-md text-sm text-white hover:bg-blue-400 duration-300 font-semibold"
        >
          Tạo giao dịch
        </button>
      </form>

      {/* Bảng nhập giao dịch */}
      {listTransaction.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmitRunClosetPlus}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-700">Danh sách giao dịch</span>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                onClick={handleAddTransaction}
              >
                <Plus size={16} /> Thêm giao dịch
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 text-left text-sm font-semibold text-blue-700">TID</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-blue-700">Danh sách</th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {listTransaction.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-gray-100">
                      <td className="py-2 px-4 font-medium">{transaction.id}</td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={transaction.listItem}
                          onChange={handleChangeList(transaction.id)}
                          className="px-2 py-1 w-full outline-none bg-gray-50 rounded border border-gray-200 focus:ring-2 focus:ring-blue-200"
                          placeholder="a,b,c,..."
                        />
                      </td>
                      <td className="py-2 px-4">
                        <button
                          type="button"
                          className="p-1 bg-red-100 rounded-full hover:bg-red-200"
                          onClick={() => handleDeleteItem(transaction.id)}
                        >
                          <Trash size={16} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              className="mt-5 w-full py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-400 duration-200 font-semibold"
            >
              Chạy thuật toán
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
