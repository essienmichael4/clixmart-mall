import { FileIcon, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FileRejection, useDropzone} from 'react-dropzone'
import { toast } from 'sonner'

interface Props{
    handleFileChange: ( value:File | undefined )=> void
}

const Dropzone = ({handleFileChange}:Props) => {
    const [files, setFiles] = useState<(File & {preview:string})[] | undefined>(undefined)

    const onDrop = useCallback((acceptedFiles:File[]) => {
        // Do something with the files
        handleFileChange(acceptedFiles[0])
        setFiles(acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
        ))
      }, [handleFileChange])

    const onDropRejected = useCallback(
        (fileRejections: FileRejection[]) => {
          const fileRejection = fileRejections[0]
          const fileError = fileRejection.errors[0]
          if (fileError.code === 'file-too-large') {
            toast.error('File is too large. Max file size is 2MB')
            handleFileChange(undefined)
            setFiles(undefined)
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
        multiple: false
      })

    const file = files?.map((file, i)=> <img key={i} className='w-100%'  src={file.preview} alt={file.name} />).filter((_e , i)=> i == 0)

      return (
        <div className="flex w-[100%] flex-col mt-4 gap-2">
            <p className='text-xs 2xl:text-sm font-bold'>Product Image</p>
            
            {!file && <div
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
            {file && <div className='w-[80%] mx-auto relative'>
              {file && <button type='button' className=' absolute top-4 right-4 p-2 bg-white/80  rounded-lg' onClick={() => setFiles(undefined)}><Trash2 className='text-rose-700 w-4 h-4' /></button>}
              {file && file}
            </div>}
            <p className='text-sm text-gray-500'>Max file size: 2.86 MB. | Allowed file types: jpeg,png,jpg | Max number of file: 1 | Min number of file: 1</p>
        </div>
      )
}

export default Dropzone
