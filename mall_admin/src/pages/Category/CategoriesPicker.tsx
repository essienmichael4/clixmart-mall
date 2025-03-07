import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { axios_instance_token } from '@/api/axios'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronsUpDown, PlusSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/lib/types'
import CreateCategory from './CreateCategory'

interface Props {
    onChange: (value: string)=>void,
    removeTag:(index:number)=>void,
    tags:string[],
}

const CategoriesPicker = ({ tags, removeTag, onChange }:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const categoriesQuery =  useQuery<Category[]>({
            queryKey: ["categories"],
            queryFn: async() => await axios_instance_token.get("/categories").then(res => res.data)
        })

    const selectedCategory = categoriesQuery.data?.find((category:Category)=> category.name === value)

    const successCallback = useCallback((category:Category)=>{
        setValue(category.name)
        setOpen(prev => !prev)
    },[setValue, setOpen])

  return (
    <div className="w-full  flex flex-col px-1 gap-1 rounded-lg">
        <div className="flex flex-wrap gap-1">
            {tags.map(( tag, index )=>(
                <div key={index} className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full">
                    {tag} <button onClick={()=>removeTag(index)} className="bg-gray-700 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center">
                    x
                    </button>
                </div>
            ) )}
        </div>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full justify-between'>
                    {selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        "Select category"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search category'/>
                    <CreateCategory trigger={
                        <Button variant={"ghost"} className='flex items-center justify-start border-separate rounded-none p-3 border-b text-muted-foreground' >
                            <PlusSquare className='mr-2 h-4 w-4' />
                            Create new category
                        </Button>
                    } successCallback={successCallback} />
                    <CommandEmpty>
                        <p>Category not found</p>
                        <p className="text-xs text-muted-foreground">Tip: Create a new category</p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {categoriesQuery?.data && 
                                categoriesQuery?.data?.map((category:Category) => {
                                    return (
                                        <CommandItem key={category.name} onSelect={()=>{
                                            setValue(category.name)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <CategoryRow category={category} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", tags.includes(category.name) && "opacity-100")} />
                                        </CommandItem>
                                    )
                                })}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    </div>
  )
}

function CategoryRow({category}:{category:Category}){
    return (
        <div className="flex items-center gap-2">
            <span className='capitalize'>{category.name}</span>
        </div>
    )
}

export default CategoriesPicker
