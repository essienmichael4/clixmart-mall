
interface Props {
    newColor: string,
    customColors: string[],
    setNewColor: (value:string) => void,
    setCustomColors: (values: string[]) => void,
    setShowColorPicker: (value: boolean) => void
}

const ColorPicker = ({newColor, customColors, setNewColor, setCustomColors, setShowColorPicker}: Props) => {
    return (
        <>
            {/* {Color Picker} */}
            <div className='relative flex items-center gap-2'>
                <input 
                    type='color' 
                    value={newColor} 
                    onChange={(e)=> setNewColor(e.target.value)}
                    className='w-10 h-10 p-0 border-none cursor-pointer' 
                />
                <button 
                    type='button'
                    onClick={()=>{
                        setCustomColors([...customColors, newColor])
                        setShowColorPicker(false)
                    }}
                    className='px-3 py-1 bg-gray-700 text-white rounded-md test-sm'
                > Add</button>
            </div>
        </>
    )
}

export default ColorPicker
