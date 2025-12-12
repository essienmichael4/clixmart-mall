import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { User } from "@/lib/types"
import { RegisterUserSchemaType, RegisterUserSchema } from "@/schema/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { PlusSquare, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
    successCallback: (user:User)=>void
}

const AddAccountDialog = ({successCallback}: Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<RegisterUserSchemaType>({
        resolver:zodResolver(RegisterUserSchema),
        defaultValues:{
            name: "",
            email: "",
            role: "USER"
        }
    })

    const addUser = async (data:RegisterUserSchemaType)=>{
        const response = await axios_instance_token.post(`/auth/signup`, {
            ...data,
            departments: ["Carrier"]
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addUser,
        onSuccess: async (data: User)=>{
            toast.success("User added successfully", {
                id: "add-admin"
            })

            successCallback(data)
            queryClient.invalidateQueries({queryKey: ["users"]})

            form.reset({
                name: "",
                email: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-admin"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-admin"
                })
            }
        }
    })

    const onSubmit = (data:RegisterUserSchemaType)=>{
        toast.loading("Adding user...", {
            id: "add-admin"
        })
        mutate(data)
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} className='flex items-center text-xs justify-start border-separate rounded-none p-3 border-b text-muted-foreground' >
                    <PlusSquare className='mr-2 h-3 w-3'>
                    </PlusSquare>
                    Add Account
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add User
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        
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
                        {!isPending && "Add User"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAccountDialog
