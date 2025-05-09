import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { IState } from 'country-state-city'

interface Props {
    data: IState[] | undefined,
    selected: IState | undefined,
    onChange: (value:IState)=>void
}

const StatePicker = ({data, selected, onChange}:Props) => {
    const [open, setOpen] = useState(false)

    const selectedCategory = data?.find((state)=> state.name === selected?.name)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedCategory ? (
                        <StatusRow state={selectedCategory} />
                    ) : (
                        "Select state"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search category'/>
                    <CommandGroup>
                        <CommandList>
                            {data?.map((state) => {
                                    return (
                                        <CommandItem key={state.isoCode} onSelect={()=>{
                                            onChange(state)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow state={state} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", selected?.name===state.name && "opacity-100")} />
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

function StatusRow({state}:{state:IState}){
    return (
        <div className="flex items-center gap-2 text-xs">
            <span>{state.name}</span>
        </div>
    )
}

export default StatePicker
