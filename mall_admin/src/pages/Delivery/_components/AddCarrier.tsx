import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import useAxiosToken from "@/hooks/useAxiosToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { CarrierSchema, CarrierSchemaType } from "@/schema/carrier";
import AccountPicker from "./AccountPicker";
import HubPicker from "./HubPicker";
import VehiclesPicker from "./VehiclesPicker";

interface Props{
    trigger?: React.ReactNode,
}

const AddCarrier = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [ , setSelectedVehicles] = useState<number[]>([])

    const form = useForm<CarrierSchemaType>({
        resolver:zodResolver(CarrierSchema),
        defaultValues:{
            // name: "",
        }
    })

    const AddCarrier  = async (data:CarrierSchemaType)=>{
        const response = await axios_instance_token.post(`/carrier`, {
            ...data,
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: AddCarrier ,
        onSuccess: ()=>{
            toast.success("Carrier added successfully", {
                id: "create-carrier"
            })

            queryClient.invalidateQueries({queryKey: ["carriers"]})

            form.reset({
                
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message || "Carrier creation failed", {
                    id: "create-carrier"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "create-carrier"
                })
            }
        }
    })

    const onSubmit = (data:CarrierSchemaType)=>{
        toast.loading("Adding carrier...", {
            id: "create-carrier"
        })
        mutate(data)
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Carrier
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
                                name="accountId"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Carrier Name</FormLabel>
                                        <FormControl>
                                            <AccountPicker onChange={(value) => field.onChange(value)} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                            {/* <FormField */}
                                {/* render={() =>( */}
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Vehicles</FormLabel>
                                        <FormControl>
                                            <VehiclesPicker  onChange={(value) => setSelectedVehicles(value)} />
                                        </FormControl>
                                    </FormItem>
                                {/* )}  */}
                            {/* /> */}

                            <FormField
                                control={form.control}
                                name="hubId"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Affiliated Hub</FormLabel>
                                        <FormControl>
                                            <HubPicker onChange={(value) => field.onChange(value)} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
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
                        {!isPending && "Add Carrier"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddCarrier
