import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { axios_instance_token } from '@/api/axios'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import CreateCategory from './CreateCategory'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/lib/types'

interface Props {
    // type:TransactionType,
    onChange: (value: string)=>void
}

const SubCategoryPicker = ({ onChange }:Props) => {
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
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
                {selectedCategory ? (
                    <CategoryRow category={selectedCategory} />
                ) : (
                    "Select category"
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='wi[200px] p-0'>
            <Command onSubmit={e=> e.preventDefault()}>
                <CommandInput placeholder='Search category'/>
                <CreateCategory successCallback={successCallback}/>
                <CommandEmpty>
                    <p>Category not found</p>
                    <p className="text-xs text-muted-foreground">Tip: Create a new category</p>
                </CommandEmpty>
                <CommandGroup>
                    <CommandList>
                        {categoriesQuery?.data && 
                            categoriesQuery?.data?.map((category:Category) => {                              
                                console.log(categoriesQuery.data)
                                return (
                                    <CommandItem key={category.name} onSelect={()=>{
                                        setValue(category.name)
                                        setOpen(prev=>!prev)
                                    }}>
                                    <CategoryRow category={category} />
                                    <Check className={cn("mr-2 w-4 h-4 opacity-0", value===category.name && "opacity-100")} />
                                    </CommandItem>
                                )
                            })}
                    </CommandList>
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
  )
}

function CategoryRow({category}:{category:Category}){
    return (
        <div className="flex items-center gap-2">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{category.name}</span>
        </div>
    )
}

export default SubCategoryPicker
