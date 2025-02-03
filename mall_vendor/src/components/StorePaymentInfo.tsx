import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "./ui/form"
import { Input } from "./ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { StorePaymentInfoSchema, StorePaymentInfoSchemaType } from "@/schema/store"
import { toast } from "sonner"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import ModePicker from "./ModePicker"
import { Separator } from "./ui/separator"
import { Store } from "@/lib/types"
import { useNavigate } from "react-router-dom"

interface Props {
    store:Store | undefined,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StorePaymentInfo = ({store, formStep, setFormStep}:Props) => {
    
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const form = useForm<StorePaymentInfoSchemaType>({
        resolver: zodResolver(StorePaymentInfoSchema),
        defaultValues:{
            paymentMode: "BANK",
            accountName: "",
            accountNumber: "",
            provider: ""
        }
    })
    
    const handleModeChange = (value:"BANK" | "MOMO")=>{
        form.setValue("paymentMode", value)        
    }

    const addStorePayment = async (data:StorePaymentInfoSchemaType)=>{
        const response = await axios_instance_token.post(`/stores/${store?.id}/payment-details`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStorePayment,
        onSuccess: ()=>{
            toast.success("Store payment added successfully", {
                id: "create-store"
            })

            form.reset({
                paymentMode: "BANK",
                accountName: "",
                accountNumber: "",
                provider: ""
            })

            queryClient.invalidateQueries({queryKey: ["stores"]})

            navigate("/wizard", {replace:true})
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "create-store"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "create-store"
                })
            }
        }
    })
    
    const onSubmit = async (data:StorePaymentInfoSchemaType) =>{
        toast.loading("Adding store payment details...", {
            id: "create-store"
        })
        mutate(data)
    }

    return (
        <div className="border w-full md:w-2/3 lg:w-2/4 p-4 rounded-lg mb-12">
            <h3 className="text-xl font-semibold mb-2">Additional Store Information</h3>
            <Separator />
            <Form {...form}>
                <form className='md:w-full  mt-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="paymentMode"
                        render={({}) =>(
                            <FormItem className='flex flex-col mb-2 gap-1'>
                            <FormLabel className='text-xs lg:text-sm font-semibold'>Registration Status</FormLabel>
                            <FormControl>
                                <ModePicker onChange={handleModeChange}/>
                            </FormControl>
                            <FormDescription>Store registratation status</FormDescription>
                        </FormItem>
                        )} 
                    />

                    <FormField 
                        control={form.control}
                        name="provider"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-2 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Provider</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter the institution name' {...field} />
                                </FormControl>
                                <FormDescription>Institution you hold an acccount with. (Telecel, GCB PLC)</FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="accountName"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-2 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Account name</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter the name on your account' {...field} />
                                </FormControl>
                                <FormDescription>Name on account.</FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="accountNumber"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-2 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Account number</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter the account number' {...field} />
                                </FormControl>
                                <FormDescription>Number of account.</FormDescription>
                            </FormItem>
                        )}
                    />    
                </form>
            </Form> 
            <div className="mt-4 flex gap-4">
                <Button onClick={()=>setFormStep(formStep -1)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                    Back
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                >
                    {!isPending && "Next"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>
            </div>
        </div>
    )
}

export default StorePaymentInfo
