import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { axios_instance_token } from '@/api/axios'
import { Store } from '@/lib/types'

interface Props {
    onChange: (value: string)=>void,
    defaultValue?: string
}

const StorePicker = ({onChange, defaultValue}:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const storesQuery =  useQuery<Store[]>({
        queryKey: ["vendors"],
        queryFn: async() => await axios_instance_token.get("/stores").then(res => res.data)
    })

    const selectedStore = storesQuery.data?.find((store:Store)=> store.storeId === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedStore ? (
                        <StoreRow storeName={selectedStore.name} />
                    ) : (
                        "Select vendor"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search vendors'/>
                    <CommandGroup>
                        <CommandList>
                            {storesQuery?.data && 
                                storesQuery.data.map((store:Store) => {
                                    return (
                                        <CommandItem key={store.id} onSelect={()=>{
                                            setValue(store.storeId as string)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StoreRow storeName={store.name} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===store.name && "opacity-100")} />
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

function StoreRow({storeName}:{storeName:string}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{storeName}</span>
        </div>
    )
}

export default StorePicker
