import { FileIcon, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FileRejection, useDropzone} from 'react-dropzone'
import { toast } from 'sonner'

interface Props{
    handleFileChange: ( value:File[] | undefined )=> void
}

const ProductSecondaryImages = ({ handleFileChange}:Props) => {
    const [files, setFiles] = useState<(File & {preview:string})[] | undefined>(undefined)

    const onDrop = useCallback((acceptedFiles:File[]) => {
      // Do something with the files
      handleFileChange(acceptedFiles)
      setFiles((prev) => {
        let result = prev
        let newFiles = acceptedFiles!.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }))
        
        //@ts-ignore
        result = [...result, ...newFiles]
        
        return result
      })
    }, [handleFileChange])

    const handleRemoveImage = (index:number) => {
      const filteredFiles = files?.filter((_e, i) => i != index)
      handleFileChange(filteredFiles)
      setFiles(filteredFiles)
    }

    const onDropRejected = useCallback(
      (fileRejections: FileRejection[]) => {
        const fileRejection = fileRejections[0]
        const fileError = fileRejection.errors[0]
        if (fileError.code === 'file-too-large') {
          toast.error('File is too large. Max file size is 2MB')
        }
      },
      []
    )

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      onDropRejected,
      accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
      },
      maxSize: 2 * 1024 * 1024,
      multiple: true,
      maxFiles: 4,
    })

    // const file = files?.map((file, i)=> <img key={i} src={file.preview} alt={file.name} />).filter((_e , i)=> i == 0)

      return (
        <div className="flex flex-col mt-4 gap-2">
            <p className='text-xs 2xl:text-sm font-bold'>Alipay/WeChat QR code</p>
            
            {!files || files.length == 0 && <div
                {...getRootProps({
                className:
                    'dropzone dropzone-border border border-dashed relative overflow-hidden rounded-xl bg-transparent p-10 cursor-pointer w-full flex flex-col gap-y-4 items-center aspect-video justify-center',
                })}
            >
                <input {...getInputProps()} />
                <FileIcon className=' text-gray-500'/>
        
                <p className="text-base md:text-xl text-gray-500">
                    Drag and drop or click to upload an image
                </p>
                
            </div>}
            {files && files.length > 0 && <div className='w-[80%] mx-auto aspect-square flex flex-wrap justify-between items-center'>
              {files.length < 4  && <div
                {...getRootProps({
                className:
                    'w-[47%] dropzone dropzone-border border border-dashed relative overflow-hidden rounded-xl bg-transparent p-10 cursor-pointer flex flex-col gap-y-4 items-center aspect-square justify-center',
                })}
                >
                    <input {...getInputProps()} />
                    <FileIcon className=' text-gray-500'/>
            
                    <p className="text-base md:text-xl text-gray-500">
                        Drag and drop or click to upload an image
                    </p>
                    
                </div>}
              {files && files.map((file, i)=> (<div className='aspect-square w-[47%] relative'>
                <button type='button' className='absolute top-2 right-2 bg-white/80 p-1 rounded-lg' onClick={() => handleRemoveImage(i)}><Trash2 className='text-rose-700 w-4 h-4' /></button>
                <img key={i} src={file.preview} alt={file.name} />
                </div>)
              )}
            </div>}
            <p className='text-sm text-gray-500'>Max file size: 2.86 MB. | Allowed file types: jpeg,png,jpg | Max number of file: 4 | Min number of file: 1</p>
        </div>
      )
}

export default ProductSecondaryImages
