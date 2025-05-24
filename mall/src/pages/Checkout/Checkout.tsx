import CartItem from "@/components/CartItem"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import useAuth from "@/hooks/useAuth"
import useAxiosToken from "@/hooks/useAxiosToken"
import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { User } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ArrowLeft, Building2, Home, Info, Loader2, MapPinned } from "lucide-react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import AddNewAddress from "../User/AddNewAddress"

const Checkout = () => {
  const navigate = useNavigate()
  const {cartItems, getTotalCost, emptyCart} = useCart()
  const [isPending, setIsPending] = useState(false)
  // const [address, setAddress] = useState<Address | undefined>(undefined)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const axios_instance_token = useAxiosToken()
  const {auth} = useAuth()

  
  const {data:user} = useQuery<User>({
    queryKey: ["user"],
    queryFn: async() => await axios_instance_token.get(`/users/${auth?.id}`).then(res => {
      return res.data     
    }),
    enabled: !!auth?.id,
  })
  
  useEffect(() => {
    if (user?.addresses?.length && !selectedAddressId) {
      setSelectedAddressId(user.addresses[0].addressId || null);
    }
  }, [user]);

  const handleCreateOrder = async ( )=>{
    try{
      setIsPending(true)
      toast.loading("Ordering...", {
          id: "order"
      })
      
      await axios_instance_token.post("/orders", {
          items: cartItems,
          addressId: selectedAddressId,
      })

      setIsPending(false)
      emptyCart()
      toast.success("Order placed successfully...", {
          id: "order"
      })
    }catch(err:any){
      setIsPending(false)
      if (axios.isAxiosError(err)){
        toast.error(err?.response?.data?.message, {
          id: "order"
        })
      }
    }
  }
  
  return (
  cartItems.length > 0  ?
    <div>
      <div className="flex flex-col flex-wrap mt-4 gap-2">
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-gray-400" />
           <span className="text-xs text-gray-400">Back to cart</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col ">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-xl">Checkout</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row my-4">
        <div className="w-full md:w-3/4 px-2">
          <div className="flex flex-wrap mb-4 gap-2 justify-between">
            <div className="border w-full md:w-[49%] rounded-lg p-4 h-48">
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="overflow-y-scroll h-40">
                    <RadioGroup
                      value={selectedAddressId ?? ""}
                      onValueChange={(value) => setSelectedAddressId(value)}
                      className="space-y-2"
                    >
                      <div>
                        <h4 className="font-bold text-sm">Choose a delivery address</h4>
                        <span className="text-xs">Your first address will be set as default if you don't choose.</span>
                      </div>
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`border flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            selectedAddressId === addr.addressId ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          <div>
                            {addr.addressType === "HOME" && <div className='flex gap-1 items-center mb-2'>
                              <Home className='text-gray-400 w-[.85rem] h-[.85rem]'/> <span className='text-gray-400 text-xs capitalize'>{addr.addressType}</span>
                            </div>}
                            {addr.addressType === "OFFICE" && <div className='flex gap-1 items-center'>
                              <Building2 className='text-gray-400 w-[.85rem] h-[.85rem]'/> <span className='text-gray-400 text-xs capitalize'>{addr.addressType}</span>
                            </div>}
                            <p className='text-gray-600 text-xs'>{addr.addressLineOne}</p>
                            {addr.addressLineTwo && <p className='text-gray-400 text-xs'>{addr.addressLineTwo}</p>}
                            {addr.landmark && <p className='text-gray-400 text-xs'>Near: {addr.landmark}</p>}
                            <p className='text-gray-400 text-xs'>{addr.city} . {addr.state} . {addr.country}</p>

                          </div>
                          <RadioGroupItem value={addr.addressId as string} id={addr.addressId} />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-gray-100">
                      <MapPinned />
                    </div>
                    <p className="font-bold mt-2">No address saved yet</p>
                    <p className="text-xs text-gray-500">Add an address so we can get tracking your delivery!</p>
                    <AddNewAddress userId={Number(user?.id)} trigger={
                      <button className="mt-3 py-2 px-4 bg-cyan-500 rounded-md font-semibold text-white text-xs">
                        Add new location
                      </button>
                    } />
                  </div>
                )}
              {/* </div> */}

            </div>
            <div className="border w-full md:w-[49%] rounded-lg p-4 h-48">
              <div className="flex flex-col">
                <h4 className="font-bold text-sm">Choose how to pay</h4>
                <div className="mt-2">
                  
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border border-gray-300 rounded-full"></div>
                        <div className="flex flex-col">
                          <Label htmlFor="option-one" className="font-semibold text-sm">Pay on pick-up</Label>
                          <span className="text-xs">Make payment when picking up goods</span>
                        </div>
                      </div>
                      <RadioGroupItem className="accent-cyan-500" value="option-one" id="option-one" />
                    </div>
                    
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                    </div> */}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg">
            <div className="flex items-center p-6 gap-2">
              <div>
                <Info className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Check your products before checkout</p>
                <span className="text-xs text-gray-500">Ensure every detail is perfect before completing your purchase.</span>
              </div>
            </div>
            <div className="rounded-lg bg-white">
              {cartItems.map((item)=> (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col md:w-1/4 p-2 h-60 border rounded-lg space-y-2">
            <h4 className="text-sm font-bold">Order Summary</h4>
            <div className="flex items-center justify-between ">
                <h4 className="text-xs">Subtotal</h4>
                <p className="text-xs">
                {FormatCurrency(
                    getTotalCost()
                )}
                </p>
            </div>
            <div className="flex items-center justify-between ">
                <h4 className="text-xs">Discount</h4>
                <p className="text-xs">
                {FormatCurrency(0)}
                </p>
            </div>
            <div className="flex items-center justify-between ">
                <h4 className="text-xs">Tax</h4>
                <p className="text-xs">
                {FormatCurrency(0)}
                </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between ">
                <h4 className="text-xs">Total</h4>
                <p className="text-xs">
                {FormatCurrency(
                    getTotalCost()
                )}
                </p>
            </div>
            <div className="flex bg-gray-100 my-3 rounded-full border focus-within:border-gray-500">
                <input  className="border-none rounded-l-full flex-1 py-2 px-3 outline-none bg-transparent text-xs shadow-none" placeholder="Apply promo code" />
                <button className="text-xs bg-cyan-700 text-white px-4 rounded-full">Apply</button>
            </div>
            <button onClick={handleCreateOrder} className="w-full text-xs py-2 bg-blue-700 text-white rounded-full">
                {!isPending && "Checkout"}
                {isPending && <Loader2 className='animate-spin' /> }
            </button>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div></div>
      </div>
    </div> : <Navigate to={'../cart'}  />
  )
}

export default Checkout