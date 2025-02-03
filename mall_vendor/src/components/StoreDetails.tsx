import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "./ui/form"
import { Input } from "./ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation } from "@tanstack/react-query"
import { StoreDetailSchema, StoreDetailSchemaType } from "@/schema/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"
import StatusPicker from "./StatusPicker"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { Separator } from "./ui/separator"
import { Store } from "@/lib/types"

interface Props {
    store:Store | undefined,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreDetails = ({store, formStep, setFormStep}:Props) => {
    const axios_instance_token = useAxiosToken()
    // const queryClient = useQueryClient()
    const form = useForm<StoreDetailSchemaType>({
        resolver: zodResolver(StoreDetailSchema),
        defaultValues:{
            nationalId: "",
            isRegistered: "FALSE"
        }
    })

    const handleStatusChange = (value:"TRUE" | "FALSE")=>{
        form.setValue("isRegistered", value)        
    }

    const addStoreDetails = async (data:StoreDetailSchemaType)=>{
        const response = await axios_instance_token.post(`/stores/${store?.id}/store-details`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStoreDetails,
        onSuccess: (data)=>{
            toast.success("Store details added successfully", {
                id: "create-store"
            })

            form.reset({
                nationalId: data.nationalID,
                isRegistered: data.isRegistered
            })

            // queryClient.invalidateQueries({queryKey: ["stores"]})

            setFormStep(formStep + 1)
            // setOpen(prev => !prev)
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
    
    const onSubmit = async (data:StoreDetailSchemaType) =>{
        toast.loading("Updating store information...", {
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
                        name="nationalId"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>National ID</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter your national ID number' {...field} />
                                </FormControl>
                                <FormDescription>National ID card number for identification.</FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="isRegistered"
                        render={({}) =>(
                            <FormItem className='flex flex-col'>
                            <FormLabel className='my-1 text-xs'>Registration Status</FormLabel>
                            <FormControl>
                                <StatusPicker onChange={handleStatusChange}/>
                            </FormControl>
                            <FormDescription>Store registratation status</FormDescription>
                        </FormItem>
                        )} 
                    />
                        
                </form>
            </Form> 
            <div className="mt-4 flex gap-4">
                <Button onClick={()=>setFormStep(formStep - 1)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
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

export default StoreDetails
