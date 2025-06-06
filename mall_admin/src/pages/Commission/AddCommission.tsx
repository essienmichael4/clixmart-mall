import React, { useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import CategoryPicker from '../Category/CategoryPicker'
import { CommissionSchema, CommissionSchemaType } from '@/schema/commissions'

interface Props{
  trigger?: React.ReactNode,
}

const AddCommission = ({trigger}:Props) => {
  const [open, setOpen] = useState(false)
  const axios_instance_token = useAxiosToken()
  const queryClient = useQueryClient()

  const form = useForm<CommissionSchemaType>({
    resolver:zodResolver(CommissionSchema),
    defaultValues:{
      category: "",
    }
  })

  const addCommission = async (data:CommissionSchemaType)=>{
    const response = await axios_instance_token.post(`/commissions`, {
      ...data,
    },)

    return response.data
  }

  const handleCategoryChange = useCallback((value:string)=>{
    form.setValue("category", value)
  }, [form])


  const {mutate, isPending} = useMutation({
    mutationFn: addCommission,
    onSuccess: ()=>{
      toast.success(`Commission created successfully`, {
          id: "add-commission"
      })

      form.reset()

      queryClient.invalidateQueries({queryKey: ["commissions"]})

      setOpen(prev => !prev)
    },onError: (err:any) => {
      if (axios.isAxiosError(err)){
        toast.error(err?.response?.data?.message, {
          id: "add-commission"
        })
      }else{
        toast.error(`Something went wrong`, {
          id: "add-commission"
        })
      }
    }
  })

  const onSubmit = (data:CommissionSchemaType)=>{
    toast.loading("Creating commission...", {
      id: "add-commission"
    })
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-[90%] mx-auto rounded-2xl'>
        <DialogHeader className='items-start'>
            <DialogTitle>
                Create Commission
            </DialogTitle>
            <DialogDescription className='text-xs'>
                Commission are charged on products based on its category
            </DialogDescription>
        </DialogHeader>
        <ScrollArea className=''>
          <Form {...form}>
            <form className='space-y-2'>
              <FormField 
                name="category"
                render={({}) =>(
                    <FormItem className='flex flex-col'>
                        <FormLabel className='text-xs'>Category</FormLabel>
                        <FormControl>
                          <CategoryPicker onChange={handleCategoryChange} />
                        </FormControl>
                        <FormDescription>Select category</FormDescription>
                    </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate"
                render={({field}) =>(
                  <FormItem className='flex-1'>
                    <FormLabel className='text-xs'>Rate</FormLabel>
                    <FormControl className='px-1'>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription>Eg: 10 will be converted to 0.1</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </form>
          </Form>
        </ScrollArea>
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
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
          >
            {!isPending && "Create commission"}
            {isPending && <Loader2 className='animate-spin' /> }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCommission
