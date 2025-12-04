import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Mmda } from "@/lib/types"
import { MmdaSchema, MmdaSchemaType } from "@/schema/location"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusSquare, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import MmdaTypePicker from "./MmdaTypePicker"
import RegionPicker from "./RegionPicker"

interface Props {
    successCallback: (mmda:Mmda)=>void
}

const AddMmda = ({successCallback}: Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const form = useForm<MmdaSchemaType>({
        resolver: zodResolver(MmdaSchema),
        defaultValues:{
            name: "",
        }
    })

    const addMmda = async (data:MmdaSchemaType) => {
        const response = await axios_instance_token.post(`/locations/mmdas`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addMmda,
        onSuccess: async (data:Mmda)=> {
            form.reset({
                name: "",
            })

            toast.success(`Mmda ${data.name} created successfully`, {
                id: "create-hub-type"
            })

            successCallback(data)

            await queryClient.invalidateQueries({
                queryKey: ["locations", "mmdas"]
            })

            setOpen(prev=> !prev)
        },
        onError: ()=>{
            toast.error(`Something went wrong`, {
                id: "create-hub-type"
            })
        }
    })

    const onSubmit = useCallback((values: MmdaSchemaType) => {
        toast.loading(`Creating Mmda...`, {
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
                    Create new mmda (Metropolitan Municipal District Authority)
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader className='space-y-1'>
                    <DialogTitle className="text-md">
                        Create new (Metropolitan Municipal District Authority)
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        District where delivery hub can be located
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} className="w-full">
                    <form className='' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='District name' className="text-xs" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">This is how your Mmda will appear in the app.</FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 w-full">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) =>(
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-xs">Mmda Type</FormLabel>
                                        <FormControl>
                                            <MmdaTypePicker onChange={(mmda)=> {
                                                field.onChange(mmda)
                                            }} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({field}) =>(
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-xs">Region</FormLabel>
                                        <FormControl>
                                            <RegionPicker onChange={(region)=> {field.onChange(region)}} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="capital"
                                render={({field}) =>(
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-xs">Capital (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Accra Central' className="text-xs" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) =>(
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-xs">Code (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder='TM, AS, SP' className="text-xs" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        
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

export default AddMmda
