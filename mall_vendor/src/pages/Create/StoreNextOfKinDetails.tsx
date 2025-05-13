import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { NextOfKinInfoSchema, NextOfKinInfoSchemaType } from "@/schema/store"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "../../components/ui/button"
import { Loader2 } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { useState } from "react"
import { Separator } from "../../components/ui/separator"
import { Store } from "@/lib/types"
import { useNavigate } from "react-router-dom"

interface Props {
    store:Store | undefined,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreNextOfKinDetails = ({store, formStep, setFormStep}:Props) => {
    const [phone, setPhone] = useState("")
    const axios_instance_token = useAxiosToken()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const form = useForm<NextOfKinInfoSchemaType>({
        resolver: zodResolver(NextOfKinInfoSchema),
        defaultValues:{
            name: "",
            phone: "",
        }
    })

    const addNextOfKin = async (data:NextOfKinInfoSchemaType)=>{
        const response = await axios_instance_token.post(`/stores/${store?.id}/next-of-kin`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addNextOfKin,
        onSuccess: ()=>{
            toast.success("Store setup has been submitted for reviewing and approval. You will receive a message when reviewing is complete.", {
                id: "create-store"
            })

            form.reset({
                name: "",
                phone: ""
            })

            queryClient.invalidateQueries({queryKey: ["stores"]})

            setFormStep(1)
            navigate("../wizard", {replace:true})
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
    
    const onSubmit = async (data:NextOfKinInfoSchemaType) =>{
        toast.loading("Adding store payment details...", {
            id: "create-store"
        })
        mutate(data)
    }
    return (
        <div className="border w-full md:w-2/3 lg:w-2/4 p-4 rounded-lg mb-12">
            <h3 className="text-xl font-semibold mb-2">Next Of Kin Information</h3>
            <Separator />
            <Form {...form}>
                <form className='md:w-full mt-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter next of kin name' {...field} />
                                </FormControl>
                                <FormDescription>Fullname of next of kin.</FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="phone"
                        render={({}) =>(
                            <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Phone</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        country="gh"
                                        value={phone}
                                        onChange={(value)=>setPhone(value)}
                                        onBlur={()=>form.setValue("phone", phone)}
                                        containerStyle={{
                                            width: "100%",
                                            border: "1 px solid #ebebeb"
                                        }}
                                    />
                                </FormControl>
                                {/* <FormDescription>Contact to be reached on.</FormDescription> */}
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
                    {!isPending && "Finish"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>
            </div>
        </div>
    )
}

export default StoreNextOfKinDetails
