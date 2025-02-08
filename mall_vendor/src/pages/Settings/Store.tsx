import useAxiosToken from "@/hooks/useAxiosToken"
import { Store } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import cover from '@/assets/pexels-donald-tong-23273.jpg'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

const VendorDetails = () => {
    const {store} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()

    const storeQuery = useQuery<Store>({
        queryKey: ["vendor", store],
        queryFn: async() => await axios_instance_token.get(`/stores/${store}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between flex-wrap mb-4 lg:mb-0 px-4 mt-4">
                <div className="flex flex-wrap items-center gap-4 ">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-12 h-12 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-3xl font-semibold">Vendor Information</h4>
                            </div>
                            {/* <span className={`${store.data?.status === "ON_HOLD" && 'bg-gray-300'} ${store.data?.status === "ARRIVED" && 'bg-emerald-300 text-emerald-700'} ${store.data?.status === "EN_ROUTE" && 'bg-yellow-300 text-yellow-700'} ${store.data?.status === "DELIVERED" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{store.data?.status}</span> */}
                        </div>
                        {/* <p className="mb-2 text-xs lg:text-sm text-muted-foreground">{FormattedDate(new Date(store.data?.createdAt as string))} at {FormattedTime(new Date(store.data?.createdAt as string))} from drafts</p> */}
                    </div>
                </div>
                <div className="flex flex-col flex-wrap justify-self-end gap-2">
                    <div className="flex flex-wrap gap-2">
                        {/* {store.data && <EditStoreReview  item={store.data} trigger={<Button variant={"outline"}><Edit className="w-4 h-4"/>Vendor Approval</Button>} />} */}
                    </div>                    
                </div>
            </div>
            <div className='bg-white my-4 mx-4 pb-4 border border-gray-300 rounded-lg h-full relative'>
                <div className='w-full h-36 bg-gray-200 bg-cover bg-center rounded-lg relative' style={{backgroundImage:`url(${cover})`}}>
                    {/* <span className={`${account.data?.loanDetail?.state == "GRANTED" && "bg-green-400"} ${account.data?.loanDetail?.state == "NEW" && "bg-yellow-400"} ${account.data?.loanDetail?.state == "CLOSED" && "bg-red-400"} ${account.data?.loanDetail?.state == "UNGRANTED" && "bg-gray-400"} rounded-lg text-white absolute right-2 top-2 py-2 px-4`}>{account.data?.loanDetail?.state}</span> */}
                </div>
                <div className='pt-8 px-4'>
                    <div className='absolute w-28 h-28 rounded-full bg-white border border-gray-200 top-12 left-4'></div>
                        <h3 className="text-3xl capitalize">{storeQuery.data?.name}</h3>
                        <p className="text-gray-400">{storeQuery.data?.url}</p>
                        <Separator />

                        <div className="my-4">
                            <h4 className="text-xl font-semibold">Vendor Information</h4>
                            <div className='flex flex-wrap gap-8'>
                                <div>
                                    <span className='text-xs text-gray-300'>Vendor</span>
                                    <p className="capitalize">{storeQuery.data?.user?.name}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Vendor email</span>
                                    <p>{storeQuery.data?.user?.email}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Vendor National ID</span>
                                    <p>{storeQuery.data?.storeDetail?.nationalId}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Vendor Registration Status</span>
                                    <p>{storeQuery.data?.storeDetail?.isRegistered  === "TRUE" ? "Registered" : "Not Registered"}</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="my-4">
                            <h4 className="text-xl font-semibold">Vendor Address</h4>
                            <div className='flex flex-wrap gap-8'>
                                <div>
                                    <span className='text-xs text-gray-300'>Name on Address</span>
                                    <p>{storeQuery.data?.storeAddress?.fullname ? storeQuery.data?.storeAddress?.fullname : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Number on Address</span>
                                    <p>+{storeQuery.data?.storeAddress?.phone ? storeQuery.data?.storeAddress?.phone : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Country</span>
                                    <p>{storeQuery.data?.storeAddress?.country ? storeQuery.data?.storeAddress?.country : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>State</span>
                                    <p>{storeQuery.data?.storeAddress?.state ? storeQuery.data?.storeAddress?.state : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>City</span>
                                    <p>{storeQuery.data?.storeAddress?.city ? storeQuery.data?.storeAddress?.city : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Street Address</span>
                                    <p>{storeQuery.data?.storeAddress?.addressLine ? storeQuery.data?.storeAddress?.addressLine : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Nearest Landmark</span>
                                    <p>{storeQuery.data?.storeAddress?.landmark ? storeQuery.data?.storeAddress?.landmark : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Zip</span>
                                    <p>{storeQuery.data?.storeAddress?.zip ? storeQuery.data?.storeAddress?.zip : "-"}</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="my-4">
                            <h4 className="text-xl font-semibold">Vendor Payment Details</h4>
                            <div className='flex flex-wrap gap-8'>
                                <div>
                                    <span className='text-xs text-gray-300'>Payment Mode</span>
                                    <p>{storeQuery.data?.paymentDetail?.provider ? storeQuery.data?.paymentDetail?.provider : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Account Provider</span>
                                    <p>{storeQuery.data?.paymentDetail?.provider ? storeQuery.data?.paymentDetail?.provider : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Account Number</span>
                                    <p>{storeQuery.data?.paymentDetail?.accountNumber ? storeQuery.data?.paymentDetail?.accountNumber : "-"}</p>
                                </div>
                                <div>
                                    <span className='text-xs text-gray-300'>Country</span>
                                    <p>{storeQuery.data?.paymentDetail?.accountName ? storeQuery.data?.paymentDetail?.accountName : "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default VendorDetails
