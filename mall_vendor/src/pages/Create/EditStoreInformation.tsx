import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { StoreSchema, StoreSchemaType } from "@/schema/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"
import axios from "axios"
import { Button } from "../../components/ui/button"
import { Loader2 } from "lucide-react"
import { Separator } from "../../components/ui/separator"
import { Store } from "@/lib/types"
import { useNavigate } from "react-router-dom"

interface Props {
    store: Store | undefined,
    id: number,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreInformation = ({store, id, formStep, setFormStep}:Props) => {
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const form = useForm<StoreSchemaType>({
        resolver: zodResolver(StoreSchema),
        defaultValues:{
            name: store?.name
        }
    })

    const updateStore = async (data:StoreSchemaType)=>{
        const response = await axios_instance_token.patch(`/stores/${id}/store-info`, {
            ...data
        },)
        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateStore,
        onSuccess: (data)=>{
            toast.success("Store info updated successfully", {
                id: "update-store"
            })

            form.reset({
                name: data.name
            })

            queryClient.invalidateQueries({queryKey: ["stores"]})
            queryClient.invalidateQueries({queryKey: ["stores", id]})

            setFormStep(1)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "update-store"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "update-store"
                })
            }
        }
    })
    
    const onSubmit = async (data:StoreSchemaType) =>{
        toast.loading("Creating store...", {
            id: "update-store"
        })
        mutate(data)
    }

    return (
        <div className="border w-full md:w-2/3 lg:w-2/4 p-4 rounded-lg mb-12">
            <h3 className="text-xl font-semibold mb-2">Store Information</h3>
            <Separator />
            <Form {...form}>
                <form className='md:w-full mt-4' onSubmit={form.handleSubmit(onSubmit)}>
                    
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Store name</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter your store name' {...field} />
                                </FormControl>
                                <FormDescription>This name will be used by users who wish to view items in your store.</FormDescription>
                            </FormItem>
                        )}
                    />
                        
                </form>
            </Form> 
            <div className="mt-4 flex gap-4">
                <Button onClick={()=>navigate(-1)} disabled={isPending} className='bg-gradient-to-r from-gray-500 to-gray-900 text-white'
                    >
                    Back
                </Button>
                <Button onClick={()=>setFormStep(formStep + 1)} disabled={isPending} className='bg-gradient-to-r from-black/20 to-black text-white'
                    >
                    Skip
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

export default StoreInformation
