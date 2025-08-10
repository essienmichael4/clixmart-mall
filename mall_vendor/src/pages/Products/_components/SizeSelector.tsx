import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
// import ColorPicker from './ColorPicker'
import SizePicker from './SizePicker'

const defaultSizes = [
    "XS", "S", "M", "L", "XL", "XXL", "3XL"
]

interface Props {
    sizes: string[],
    setSizes: (values: string[]) => void,
    savedSizes?: {id:number, value: string}[]
}

const SizeSelector = ({sizes, setSizes, savedSizes=[]}: Props) => {
    const [customSizes, setCustomSizes] = useState<string[]>([])
    const [showSizePicker, setShowSizePicker] = useState<boolean>(false)
    const [newSize, setNewSize] = useState<string>("")
    // combine all size
    const allSizes = useMemo(() => {
        const saved = savedSizes.map(c => c.value)
        const combined = [...defaultSizes, ...saved, ...customSizes]
        return Array.from(new Set(combined)) // remove duplicates
    }, [savedSizes, customSizes])

    return (
        <div>
            {/* {Select size from options} */}
            <label className='block font-semibold text-xs'>Sizes</label>
            <div>
                <div className='flex gap-2 flex-wrap'>
                    {allSizes.map(size=>{
                        const isSelected = (sizes || []).includes(size)
                        return (
                            <button type='button' key={size} 
                                onClick={() => 
                                    setSizes(
                                        isSelected 
                                        ? sizes.filter((c:string)=> c !== size) 
                                        : [...(sizes || []), size]
                                    )
                                }
                                className={`${isSelected ? "scale-110 border-gray-700": "border-transparent"} w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition`}
                                // style={{backgroundColor: color}}
                            >
                                {size}
                            </button>
                        )   
                    })}

                    {/* {Add new color} */}
                    <button 
                        type='button' 
                        onClick={()=> setShowSizePicker(!showSizePicker)}
                        className='w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition'>
                        <Plus size={16} color='white' />
                    </button>
                    {/* {Size Picker} */}
                    {showSizePicker && <SizePicker newSize={newSize} setNewSize={setNewSize} customSizes={customSizes} setCustomSizes={setCustomSizes} setShowSizePicker={setShowSizePicker} />}
                </div>
            </div>
        </div>
    )
}

export default SizeSelector
