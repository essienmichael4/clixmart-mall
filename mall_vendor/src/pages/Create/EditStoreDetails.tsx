import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { StoreDetailSchema, StoreDetailSchemaType } from "@/schema/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"
import StatusPicker from "../../components/StatusPicker"
import { Button } from "../../components/ui/button"
import { CircleOff, Loader2 } from "lucide-react"
import { Separator } from "../../components/ui/separator"
import { Store } from "@/lib/types"
import StoreImageDialog from "./StoreImageDialog"
import { useState } from "react"

interface Props {
    store:Store | undefined,
    id: number,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreDetails = ({store, id, formStep, setFormStep}:Props) => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [imageUrl, setImageUrl] = useState(store?.imageUrl)
    const form = useForm<StoreDetailSchemaType>({
        resolver: zodResolver(StoreDetailSchema),
        defaultValues:{
            nationalId: store?.storeDetail?.nationalId,
            isRegistered: store?.storeDetail?.isRegistered as "TRUE" | "FALSE"  || "FALSE"
        }
    })

    // const handleImageChange = useCallback((value:string | undefined)=>{
    //     setImageUrl(value)
    // }, [])

    const handleStatusChange = (value:"TRUE" | "FALSE")=>{
        form.setValue("isRegistered", value)        
    }

    console.log(imageUrl)

    const addStoreDetails = async (data:StoreDetailSchemaType)=>{
        const response = await axios_instance_token.patch(`/stores/${id}/store-details`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStoreDetails,
        onSuccess: ()=>{
            toast.success("Store details updated successfully", {
                id: "create-store"
            })

            queryClient.invalidateQueries({queryKey: ["stores"]})
            queryClient.invalidateQueries({queryKey: ["stores", id]})

            setFormStep(formStep + 1)
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
                        name='Image'
                        render={()=>(
                            <FormItem className="flex flex-col mb-4 gap-1">
                                <FormLabel className='text-xs font-semibold'>Store image</FormLabel>
                                <div className="w-[100px] mx-auto aspect-square">
                                    <FormControl >
                                        <StoreImageDialog id={store?.id} setImageUrl={setImageUrl} trigger={

                                            <Button variant={'outline'} className='h-[100px] '>
                                                {imageUrl ? 
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <img src={imageUrl} role='image'  className='w-[50px] h-[50px]'/>
                                                        <p className='text-xs text-muted-foreground'>Click to change</p>
                                                    </div>
                                                    : 
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <CircleOff  className='w-40 h-40'/>
                                                        <p className='text-xs text-muted-foreground'>Click to add</p>
                                                    </div>
                                                }
                                            </Button>
                                            }
                                        />
                                            
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="nationalId"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs font-semibold'>National ID</FormLabel>
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
                            <FormLabel className='my-1 text-xs font-semibold'>Registration Status</FormLabel>
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
                <Button onClick={()=>setFormStep(formStep - 1)} disabled={isPending} className='bg-gradient-to-r from-gray-500 to-gray-900 text-white'
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

export default StoreDetails
