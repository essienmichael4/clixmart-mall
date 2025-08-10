
interface Props {
    newSize: string,
    customSizes: string[],
    setNewSize: (value:string) => void,
    setCustomSizes: (values: string[]) => void,
    setShowSizePicker: (value: boolean) => void
}

const SizePicker = ({newSize, customSizes, setNewSize, setCustomSizes, setShowSizePicker}: Props) => {
    return (
        <>
            {/* {Color Picker} */}
            <div className='relative flex items-center gap-2'>
                <input 
                    type='text' 
                    value={newSize} 
                    onChange={(e)=> setNewSize(e.target.value)}
                    className='w-20 px-2 py-2 text-xs border' 
                />
                <button 
                    type='button'
                    onClick={()=>{
                        setCustomSizes([...customSizes, newSize])
                        setShowSizePicker(false)
                    }}
                    className='px-3 py-1 bg-gray-700 text-white rounded-md test-sm'
                > Add</button>
            </div>
        </>
    )
}

export default SizePicker
