'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (value: "METROPOLITAN" | "MUNICIPAL" | "DISTRICT")=>void
}

const MmdaTypePicker = ({onChange}:Props) => {
    const stat:("METROPOLITAN" | "MUNICIPAL" | "DISTRICT")[] = ["METROPOLITAN", "MUNICIPAL", "DISTRICT"]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"METROPOLITAN" | "MUNICIPAL" | "DISTRICT">("MUNICIPAL")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const selectedType = stat.find((status:"METROPOLITAN" | "MUNICIPAL" | "DISTRICT")=> status === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                {selectedType ? (
                    <StatusRow status={selectedType} />
                ) : (
                    "Select mmda type"
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
            <Command onSubmit={e=> e.preventDefault()}>
                <CommandInput className='text-xs' placeholder='Search mmda type'/>
                <CommandGroup>
                    <CommandList>
                        {stat.map((status:"METROPOLITAN" | "MUNICIPAL" | "DISTRICT") => {                              
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

function StatusRow({status}:{status:"METROPOLITAN" | "MUNICIPAL" | "DISTRICT"}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{status}</span>
        </div>
    )
}

export default MmdaTypePicker
