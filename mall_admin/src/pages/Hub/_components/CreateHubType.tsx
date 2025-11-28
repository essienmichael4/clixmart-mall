import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { HubType } from "@/lib/types"
import { HubTypeSchema, HubTypeSchemaType } from "@/schema/hub"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusSquare, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
    successCallback: (hubType:HubType)=>void
}

const CreateHubType = ({successCallback}: Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const form = useForm<HubTypeSchemaType>({
        resolver: zodResolver(HubTypeSchema),
        defaultValues:{
            name: "",
            description: ""
        }
    })

    const CreateHubType = async (data:HubTypeSchemaType) => {
        const response = await axios_instance_token.post(`/hubs/types`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: CreateHubType,
        onSuccess: async (data:HubType)=> {
            form.reset({
                name: "",
                description: ""
            })

            toast.success(`Hub type ${data.name} created successfully`, {
                id: "create-hub-type"
            })

            successCallback(data)

            await queryClient.invalidateQueries({
                queryKey: ["hubs", "types"]
            })

            setOpen(prev=> !prev)
        },
        onError: ()=>{
            toast.error(`Something went wrong`, {
                id: "create-hub-type"
            })
        }
    })

    const onSubmit = useCallback((values: HubTypeSchemaType) => {
        toast.loading(`Creating hub type...`, {
            id: "create-hub-type"
        })

        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant={"ghost"} className='flex items-center text-xs justify-start border-separate rounded-none p-3 border-b text-muted-foreground' >
                    <PlusSquare className='mr-2 h-3 w-3'>
                    </PlusSquare>
                    Create new
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader >
                    <DialogTitle>
                        Create Hub Type
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Hub Type are used to group your delivery hubs.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Hub type' className="text-xs" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">This is how your hub type will appear in the app.</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Hub type description' className="text-xs" {...field} />
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {!isPending && "Create"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateHubType
