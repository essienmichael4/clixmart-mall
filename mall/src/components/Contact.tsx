import { useState } from 'react'
import "react-phone-input-2/lib/style.css"
import PhoneInput from 'react-phone-input-2'
import { Form, FormControl, FormDescription, FormField, FormItem } from './ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, ContactSchemaType } from '@/schema/user'
import { toast } from 'sonner'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

interface Props {
    id: number| undefined,
    formStep:number,
    setFormStep: (value:number)=> void
}

const Contact = ({id, formStep, setFormStep}:Props) => {
    const [phone, setPhone] = useState("")
    const axios_instance_token = useAxiosToken()
    const form = useForm({
        resolver: zodResolver(ContactSchema),
        defaultValues:{
            phone: ""
        }
    })

    const addContact = async (data:ContactSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
            mutationFn: addContact,
            onSuccess: ()=>{
                toast.success("Store address added successfully", {
                    id: "create-store"
                })
    
                form.reset({
                    phone: "",
                })
    
                setFormStep(formStep+1)
            },onError: (err:any) => {
                console.log(err);
                
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

    const onSubmit = async (data:ContactSchemaType) =>{
        toast.loading("Updating store address...", {
            id: "create-store"
        })
        mutate(data)
    }

    return (
        <div>
            <Form {...form}>
                <form className='md:w-full' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="phone"
                        render={({}) =>(
                            <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                {/* <FormLabel className='text-xs lg:text-sm font-semibold'>Phone</FormLabel> */}
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
                                <FormDescription>Contact to be reached on.</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Next"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default Contact