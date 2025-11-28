import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Region } from "@/lib/types"
import { RegionSchema, RegionSchemaType } from "@/schema/location"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusSquare, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
    successCallback: (region:Region)=>void
}

const AddRegion = ({successCallback}: Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const form = useForm<RegionSchemaType>({
        resolver: zodResolver(RegionSchema),
        defaultValues:{
            name: "",
        }
    })

    const addRegion = async (data:RegionSchemaType) => {
        const response = await axios_instance_token.post(`/locations/regions`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addRegion,
        onSuccess: async (data:Region)=> {
            form.reset({
                name: "",
            })

            toast.success(`Region ${data.name} created successfully`, {
                id: "create-region"
            })

            successCallback(data)

            await queryClient.invalidateQueries({
                queryKey: ["locations", "regions"]
            })

            setOpen(prev=> !prev)
        },
        onError: ()=>{
            toast.error(`Something went wrong`, {
                id: "create-region"
            })
        }
    })

    const onSubmit = useCallback((values: RegionSchemaType) => {
        toast.loading(`Creating region...`, {
            id: "create-region"
        })

        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant={"ghost"} className='flex items-center text-xs justify-start border-separate rounded-none p-3 border-b text-muted-foreground' >
                    <PlusSquare className='mr-2 h-3 w-3'>
                    </PlusSquare>
                    Create new region
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader >
                    <DialogTitle>
                        Create Region
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Region where delivery hub can be located
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
                                        <Input placeholder='Greater Accra' className="text-xs" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">This is how the region will appear in the app.</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="capital"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Capital</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Accra' className="text-xs" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="code"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="text-xs">Code (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='GA' className="text-xs" {...field} />
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

export default AddRegion
