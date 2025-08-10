import { ProductOption } from "@/lib/types";
import { PlusCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  properties: { label: string; values: string[] }[]
  setProperties: (values: { label: string; values: string[] }[]) => void,
  savedProperties?: ProductOption[]
}

const CustomProperties = ({ properties, setProperties, savedProperties }: Props) => {
  const [newLabel, setNewLabel] = useState("")
  const [valueInputs, setValueInputs] = useState<Record<number, string>>({})

   // 🔁 Populate initial values from savedProperties
  useEffect(() => {
    if (savedProperties && savedProperties.length > 0) {
      setProperties(
        savedProperties.map(property => ({
          label: property.name,
          values: property.values.map(v => v.value)  // 👈 extract string values here
        }))
      )
    }
  }, [savedProperties])


  const addProperty = () => {
    if (!newLabel.trim()) return
    setProperties([...properties, { label: newLabel.trim(), values: [] }])
    setNewLabel("")
  }

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index))
  }

  const addValue = (index: number) => {
    const val = (valueInputs[index] || "").trim()
    if (!val) return

    const updated = [...properties]
    updated[index].values.push(val)
    setProperties(updated)

    setValueInputs(prev => ({ ...prev, [index]: "" }))
  }

  return (
    <div>
      <label className='block font-semibold text-xs mb-2'>Custom Properties</label>

      {/* Add new property section */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Property label (e.g., Size, Material)"
          className="border outline-none border-gray-300 p-2 rounded-md w-full text-xs"
        />
        <button
          type="button"
          onClick={addProperty}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
        >
          <PlusCircle size={16} /> Add
        </button>
      </div>

      {/* Existing properties */}
      <div className="flex flex-col gap-3">
        {properties.map((property, idx) => (
          <div key={idx} className="border border-gray-300 p-3 rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              {/* Editable label input */}
              <input
                type="text"
                value={property.label}
                onChange={(e) => {
                  const updated = [...properties]
                  updated[idx].label = e.target.value
                  setProperties(updated)
                }}
                className="font-medium text-sm border border-gray-300 p-1 rounded-md w-full"
              />
              <button type="button" onClick={() => removeProperty(idx)}>
                <X size={16} className="text-red-500 hover:text-red-700 ml-2" />
              </button>
            </div>

            {/* Add values to property */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={valueInputs[idx] || ""}
                onChange={(e) => setValueInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                placeholder="Enter value..."
                className="border outline-none border-gray-300 p-2 rounded-md  w-full text-xs"
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-xs"
                onClick={() => addValue(idx)}
              >
                Add
              </button>
            </div>

            {/* Show and remove values */}
            <div className="flex flex-wrap gap-2">
              {property.values.map((value, valueIdx) => (
                <div
                  key={valueIdx}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-white rounded-md text-xs"
                >
                  {value}
                  <X
                    size={12}
                    className="cursor-pointer text-red-300 hover:text-red-500"
                    onClick={() => {
                      const updated = [...properties]
                      updated[idx].values = updated[idx].values.filter((_, i) => i !== valueIdx)
                      setProperties(updated)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomProperties
