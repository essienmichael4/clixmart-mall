import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaymentSchemaType, PaymentSchema } from '@/schema/payments'
import { Store } from '@/lib/types'
import StorePicker from '@/components/StorePicker'

interface Props{
  trigger?: React.ReactNode,
  store?: Store
}

const AddPaymentDialog = ({trigger, store}:Props) => {
  const [open, setOpen] = useState(false)
  const axios_instance_token = useAxiosToken()
  const queryClient = useQueryClient()

  const form = useForm<PaymentSchemaType>({
    resolver:zodResolver(PaymentSchema),
    defaultValues:{
    }
  })

    const handleStoreChange = (value:string)=>{
        form.setValue("store", value)
    }

  const addPayment = async (data:PaymentSchemaType)=>{
    const response = await axios_instance_token.post(`stores/${data.store}/payments`, {
      amount: data.amount
    },)

    return response.data
  }

  const {mutate, isPending} = useMutation({
    mutationFn: addPayment,
    onSuccess: ()=>{
      toast.success(`Payment added successfully`, {
          id: "add-payment"
      })

      form.reset()

      queryClient.invalidateQueries({queryKey: ["payments"]})

      setOpen(prev => !prev)
    },onError: (err:any) => {
      if (axios.isAxiosError(err)){
        toast.error(err?.response?.data?.message, {
          id: "add-payment"
        })
      }else{
        toast.error(`Something went wrong`, {
          id: "add-payment"
        })
      }
    }
  })

  const onSubmit = (data:PaymentSchemaType)=>{
    toast.loading("Adding payment...", {
      id: "add-payment"
    })
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-[90%] mx-auto rounded-2xl'>
        <DialogHeader className='items-start'>
            <DialogTitle>
                Add Payment
            </DialogTitle>
            <DialogDescription className='text-xs'>
                Payments made to vendors are aggregated and deducted from their total earnings.  
            </DialogDescription>
        </DialogHeader>
        <ScrollArea className=''>
          <Form {...form}>
            <form className='space-y-2'>
                <FormField 
                    name="shipping"
                    render={({}) =>(
                        <FormItem className='flex-1'>
                            <FormLabel className='my-1 text-xs'>Vendor</FormLabel>
                            <FormControl>
                                <StorePicker onChange={handleStoreChange} defaultValue={store?.storeId}/>
                            </FormControl>
                            <FormDescription className='text-xs'> Select a vendor</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} 
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) =>(
                    <FormItem className='flex-1'>
                        <FormLabel className='text-xs'>Amount</FormLabel>
                        <FormControl className='px-1'>
                            <Input className='px-2' {...field} />
                        </FormControl>
                        <FormDescription className='text-xs'>Amount paid to vendor</FormDescription>
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
            {!isPending && "Make Payment"}
            {isPending && <Loader2 className='animate-spin' /> }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPaymentDialog
