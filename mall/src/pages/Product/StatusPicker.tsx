'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (value: "ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED")=>void
}

const StatusPicker = ({onChange}:Props) => {
    const stat:("ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED")[] = ["ON_HOLD", "EN_ROUTE", "ARRIVED", "DELIVERED"]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED">("ON_HOLD")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    

    const selectedCategory = stat.find((status:"ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED")=> status === value)

    // const successCallback = useCallback((status:"ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED")=>{
    //     setValue(status)
    //     setOpen(prev => !prev)
    // },[setValue, setOpen])

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                {selectedCategory ? (
                    <StatusRow status={selectedCategory} />
                ) : (
                    "Select status"
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='wi[200px] p-0'>
            <Command onSubmit={e=> e.preventDefault()}>
                <CommandInput placeholder='Search category'/>
                <CommandGroup>
                    <CommandList>
                        {stat.map((status:"ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED") => {                              
                                // console.log(categoriesQuery.data)
                                return (
                                    <CommandItem key={status} onSelect={()=>{
                                        setValue(status)
                                        setOpen(prev=>!prev)
                                    }}>
                                    <StatusRow status={status} />
                                    <Check className={cn("mr-2 w-4 h-4 opacity-0", value===status && "opacity-100")} />
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

function StatusRow({status}:{status:"ON_HOLD" | "EN_ROUTE" | "ARRIVED" | "DELIVERED"}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{status}</span>
        </div>
    )
}

export default StatusPicker
