import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import ColorPicker from './ColorPicker'

const defaultColors = [
    "#ffffff", "#ff0000",  "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"
]

interface Props {
    colors: string[],
    setColors: (values: string[]) => void,
    savedColors?: {id:number, value: string}[]
}

const ColorSelector = ({colors, setColors, savedColors = [] }: Props) => {
    const [customColors, setCustomColors] = useState<string[]>([])
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    const [newColor, setNewColor] = useState<string>("#ffffff")

    // combine all colors
    const allColors = useMemo(() => {
        const saved = savedColors.map(c => c.value)
        const combined = [...defaultColors, ...saved, ...customColors]
        return Array.from(new Set(combined)) // remove duplicates
    }, [savedColors, customColors])

    return (
        <div>
            {/* {Select color from options} */}
            <label className='block font-semibold text-xs'>Colors</label>
            <div>
                <div className='flex gap-2 flex-wrap'>
                    {allColors.map(color=>{
                        const isSelected = (colors || []).includes(color)
                        return (
                            <button type='button' key={color} 
                                onClick={() => 
                                    setColors(
                                        isSelected 
                                        ? colors.filter((c:string)=> c !== color) 
                                        : [...(colors || []), color]
                                    )
                                }
                                className={`${isSelected ? "scale-110 border-gray-700": "border-transparent"} w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition`}
                                style={{backgroundColor: color}}
                            >
                                
                            </button>
                        )   
                    })}

                    {/* {Add new color} */}
                    <button 
                        type='button' 
                        onClick={()=> setShowColorPicker(!showColorPicker)}
                        className='w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition'>
                        <Plus size={16} color='white' />
                    </button>
                    {/* {Color Picker} */}
                    {showColorPicker && <ColorPicker newColor={newColor} setNewColor={setNewColor} customColors={customColors} setCustomColors={setCustomColors} setShowColorPicker={setShowColorPicker} />}
                </div>
            </div>
            {/* <Controller name='colors' control={control}
                render={({field})=> (
                    <div className='flex gap-3 flex-wrap'>
                        {[...defaultColors, ...customColors].map(color=>{
                            const isSelected = (field.value || []).includes(color)
                            // const isLightColor = ["#ffffff", "#ffffoo"].includes(color)

                            return (
                                <button type='button' key={color} 
                                    onClick={()=> 
                                        field.onChange(
                                            isSelected 
                                              ? field.value.filter((c:string)=> c !== color) 
                                              : [...(field.value || [])]
                                        )
                                    }
                                    className={`${isSelected ? "scale-110 border-gray-700": "border-transparent"} w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition`}
                                    style={{backgroundColor: color}}
                                >
                                    
                                </button>
                            )   
                        })}

                        <button 
                            type='button' 
                            onClick={()=> setShowColorPicker(!showColorPicker)}
                            className='w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition'>
                            <Plus size={16} color='white' />
                        </button>
                        {showColorPicker && <ColorPicker newColor={newColor} setNewColor={setNewColor} customColors={customColors} setCustomColors={setCustomColors} setShowColorPicker={setShowColorPicker} />}
                    </div>
                )} 
            /> */}
        </div>
    )
}

export default ColorSelector
