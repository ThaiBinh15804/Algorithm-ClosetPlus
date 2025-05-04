import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExecutionStep } from "src/type"

type ExecutionStepItemProps = {
  step: ExecutionStep
  level?: number
  autoExpand?: boolean
}

export default function ExecutionStepItem({
  step,
  level = 0,
}: ExecutionStepItemProps) {
  const hasSubSteps = step.sub_steps && step.sub_steps.length > 0
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => {
    if (hasSubSteps) setExpanded((v) => !v)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (hasSubSteps && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className={`relative ${level === 0 ? "pl-8" : "pl-10"} pb-6`}>
      {/* Timeline line */}
      <span
        className={`absolute left-2.5 top-0 bottom-0 w-1.5 rounded-full ${
          level === 0
            ? "bg-gradient-to-b from-[#833AB4] to-[#FD1D1D]"
            : "bg-gray-200"
        }`}
      />
      {/* Step dot */}
      <span
        className={`absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center
          ${level === 0 ? "bg-[#833AB4]" : "bg-gray-500"}
          border-2 border-white shadow-sm
          ${hasSubSteps
            ? "cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500"
            : ""}
        `}
        {...(hasSubSteps
          ? {
              role: "button",
              "aria-label": expanded ? "Thu gọn bước" : "Mở rộng bước",
              "aria-expanded": expanded,
              tabIndex: 0,
              onClick: handleToggle,
              onKeyDown: handleKeyDown,
            }
          : {})}
      >
        {hasSubSteps && (
          <span className="text-white text-xs">
            {expanded ? "▲" : "▼"}
          </span>
        )}
      </span>
      <div>
        {step.step && (
          <h3
            className={`font-semibold select-none ${
              level === 0 ? "text-lg text-[#1a202c]" : "text-base text-gray-800"
            } mb-2 ${hasSubSteps ? "cursor-pointer hover:text-purple-600 transition-colors" : ""}`}
            {...(hasSubSteps
              ? {
                  role: "button",
                  "aria-label": expanded ? "Thu gọn bước" : "Mở rộng bước",
                  "aria-expanded": expanded,
                  tabIndex: 0,
                  onClick: handleToggle,
                  onKeyDown: handleKeyDown,
                }
              : {})}
          >
            {step.step}
            {hasSubSteps && (
              <span className="ml-2 text-purple-500 text-sm">
                {expanded ? "▲" : "▼"}
              </span>
            )}
          </h3>
        )}
        {step.description && (
          <div className="prose prose-sm text-gray-600 leading-relaxed mb-2">
            <p>
              {step.description}
              {step.details && (
                <span className="text-gray-700 font-medium italic ml-2">
                  - {step.details}
                </span>
              )}
            </p>
          </div>
        )}
        <AnimatePresence>
          {hasSubSteps && expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              <div className="mt-3 border-l-2 border-purple-100 pl-4">
                {step.sub_steps?.map((subStep, idx) => (
                  <ExecutionStepItem key={idx} step={subStep} level={level + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}