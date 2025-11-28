import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { HubType } from "@/lib/types"
import { TownSchema, TownSchemaType } from "@/schema/location"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusSquare, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import MmdaPicker from "./MmdaPicker"

interface Props {
    successCallback: (hubType:HubType)=>void
}

const AddTown = ({successCallback}: Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const form = useForm<TownSchemaType>({
        resolver: zodResolver(TownSchema),
        defaultValues:{
            name: "",
        }
    })

    const addTown = async (data:TownSchemaType) => {
        const response = await axios_instance_token.post(`/locations/towns`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addTown,
        onSuccess: async (data:HubType)=> {
            form.reset({
                name: "",
            })

            toast.success(`Town ${data.name} created successfully`, {
                id: "create-town"
            })

            successCallback(data)

            await queryClient.invalidateQueries({
                queryKey: ["locations", "towns"]
            })

            setOpen(prev=> !prev)
        },
        onError: ()=>{
            toast.error(`Something went wrong`, {
                id: "create-town"
            })
        }
    })

    const onSubmit = useCallback((values: TownSchemaType) => {
        toast.loading(`Creating town...`, {
            id: "create-town"
        })

        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant={"ghost"} className='flex items-center text-xs justify-start border-separate rounded-none p-3 border-b text-muted-foreground' >
                    <PlusSquare className='mr-2 h-3 w-3'>
                    </PlusSquare>
                    Create new town
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader >
                    <DialogTitle>
                        Add new town
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Community where delivery hubs can be located
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
                                        <Input placeholder='Town name' className="text-xs" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">This is the town will appear in the app.</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="landmark"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Landmark (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Landmark' className="text-xs" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="postcode"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Postal code (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Postcode' className="text-xs" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="mmda"
                            render={() =>(
                                <FormItem className='flex flex-col mt-2'>
                                    <FormLabel className="text-xs">(MMDA) Municipal</FormLabel>
                                    <FormControl>
                                        <MmdaPicker onChange={(value) => form.setValue("mmda", value)} />
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

export default AddTown
