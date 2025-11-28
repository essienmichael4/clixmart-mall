import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { HubType } from '@/lib/types'
import { HubSchemaType, HubSchema } from '@/schema/hub'
import HubTypePicker from './HubTypePicker'
import TownPicker from '@/components/TownPicker'
import MmdaPicker from '@/components/MmdaPicker'
import { ScrollArea } from '@/components/ui/scroll-area'
import RegionPicker from '@/components/RegionPicker'
interface Props{
    trigger?: React.ReactNode,
}

const AddHub = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const queryClient = useQueryClient()

    const hubTypesQuery = useQuery<HubType[]>({
        queryKey: ["hubs", "types"],
        queryFn: async () => await axios_instance_token.get(`/hubs/types`).then(res => {
            console.log(res.data)
            return res.data
        })
    })

    const form = useForm<HubSchemaType>({
        resolver:zodResolver(HubSchema),
        defaultValues:{
            name: "",
        }
    })

    const createHub  = async (data:HubSchemaType)=>{
        const response = await axios_instance_token.post(`/hubs`, {
            ...data,
            types: selectedTypes
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: createHub ,
        onSuccess: ()=>{
            toast.success("Hub added successfully", {
                id: "create-hub"
            })

            queryClient.invalidateQueries({queryKey: ["hubs"]})

            form.reset({
                name: "",
            })

            setSelectedTypes([])

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message || "Hub creation failed", {
                    id: "create-hub"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "create-hub"
                })
            }
        }
    })

    const onSubmit = (data:HubSchemaType)=>{
        toast.loading("Adding hub...", {
            id: "create-hub"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Hub
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2' onSubmit={(e) => {
                        e.preventDefault();  // ✅ prevents browser reload
                        form.handleSubmit(onSubmit)();
                    }}>
                        <ScrollArea className='h-56'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Hub Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                            
                            <FormItem className='flex flex-col'>
                                <FormLabel className='text-xs'>Hub Type</FormLabel>
                                <FormControl>
                                    <HubTypePicker
                                        values={Array.isArray(hubTypesQuery.data) ? hubTypesQuery.data.map(d => d.name) : []}
                                        selected={selectedTypes}
                                        onChange={(arr) => setSelectedTypes(arr)}
                                    />
                                </FormControl>
                                <FormDescription>Select one or more hub types to assign</FormDescription>
                            </FormItem>
                               
                            <FormField
                            control={form.control}
                            name="region"
                            render={({field}) =>(
                                <FormItem className='flex flex-col flex-1'>
                                    <FormLabel className='text-xs'>Region</FormLabel>
                                    <FormControl>
                                        <RegionPicker
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                    <FormDescription>Mmda delivery hub is located</FormDescription>
                                </FormItem>
                            )} />

                            <div className=' flex gap-2'>
                                <FormField
                                control={form.control}
                                name="mmda"
                                render={({field}) =>(
                                <FormItem className='flex flex-col flex-1'>
                                    <FormLabel className='text-xs'>Mmda (Optional)</FormLabel>
                                    <FormControl>
                                        <MmdaPicker
                                            regionId={form.watch("region")}
                                            onChange={(value: number) => field.onChange( value)}
                                        />
                                    </FormControl>
                                    <FormDescription>Mmda delivery hub is located</FormDescription>
                                </FormItem>
                                )} />

                                <FormField
                                control={form.control}
                                name="town"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col flex-1'>
                                        <FormLabel className='text-xs'>Town (Optional)</FormLabel>
                                        <FormControl>
                                            <TownPicker
                                                mmdaId={form.watch("mmda")}
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormDescription>Town delivery hub is located</FormDescription>
                                    </FormItem>
                                )} />
                            </div>
                        </ScrollArea>
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Add Admin"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddHub
