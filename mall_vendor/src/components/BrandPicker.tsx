import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { axios_instance_token } from '@/api/axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand } from '@/lib/types'

interface Props {
    category?:string,
    onChange: (value: string)=>void
}

const BrandPicker = ({ category, onChange }:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(category)

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const brandsQuery =  useQuery<Brand[]>({
        queryKey: ["brand", category],
        queryFn: async() => category ? 
            await axios_instance_token.get(`/brands/categories/${category}`).then(res => {
                return res.data})
            :
            await axios_instance_token.get(`/brands`).then(res => {
                return res.data})
    })

    const selectedBrand = brandsQuery.data?.find((brand:Brand)=> brand.name === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full justify-between'>
                    {selectedBrand ? (
                        <BrandRow brand={selectedBrand} />
                    ) : (
                        "Select brand"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search brand'/>
                    <CommandEmpty>
                        <p>Brand not found</p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {brandsQuery?.data && 
                                brandsQuery?.data?.map((brand:Brand) => {
                                    return (
                                        <CommandItem key={brand.name} onSelect={()=>{
                                            setValue(brand.name)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <BrandRow brand={brand} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===brand.name && "opacity-100")} />
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

function BrandRow({brand}:{brand:Brand}){
    return (
        <div className="flex items-center gap-2">
            <span>{brand.name}</span>
        </div>
    )
}

export default BrandPicker
