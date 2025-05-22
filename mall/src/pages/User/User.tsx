import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { User } from "@/lib/types"
import useAxiosToken from '@/hooks/useAxiosToken'
import EditAccountDialog from './EditAccountDialog'
import { Button } from '@/components/ui/button'
import ChangePassword from './ChangePassword'
// import { toast } from 'sonner'
// import axios from 'axios'
import useAuth from '@/hooks/useAuth'
import { Separator } from '@/components/ui/separator'
import AddNewAddress from './AddNewAddress'
import EditNewAddress from './EditNewAddress'

const UserProfile = () => {
    const {auth} = useAuth()
    
    const navigate = useNavigate()
    const {id} =useParams()
    // const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const user = useQuery<User>({
      queryKey: ["user"],
      queryFn: async() => await axios_instance_token.get(`/users/${auth?.id}`).then(res => {
        console.log(res.data);
        
        return res.data        
      })
    })

    return (
        <div className='mx-auto container mt-4 mb-16 px-4'>
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-4'>
                    <button className='p-2 bg-blue-100 flex items-center justify-center rounded-lg' onClick={()=>{navigate(-1)}}>
                        <ArrowLeft className='w-4 h-4'/>
                    </button>
                    <h4 className=" font-semibold">User Account</h4>
                </div>
                <div className=" flex items-center justify-end gap-2 flex-wrap">
                    <EditAccountDialog user={user.data as User} trigger={
                    <Button className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Profile</Button>} />
                    <ChangePassword id={Number(id)} trigger={
                    <Button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent">Change Password</Button>} />
                </div>
            </div>
            <div className='bg-white my-4 border border-gray-300 rounded-lg h-full relative'>
              <div className='w-full h-48 bg-gray-200 rounded-lg relative'>
              </div>
              <div className='px-4 pt-4 pb-8'>
                <div className='absolute w-36 h-36 rounded-full bg-white border-4 border-gray-200 top-16 left-4'></div>
                <h3 className="font-bold text-4xl">{user.data?.name}</h3>
                <p className="mt-2 text-muted-foreground">{user.data?.email}</p>
                <Separator className='my-4'/>
                <div className='flex flex-wrap gap-8'>
                  <div>
                    <h4 className='font-bold text-xs text-gray-700'>Phone</h4>
                    <p>{user.data?.phone ? user.data?.phone :"-" }</p>
                  </div>
                </div>
              </div>
          </div>
        
         <div className="mt-12">
          <div className="p-6 mt-10 border border-gray-300 rounded-lg">
            <div className='flex items-center justify-between'>
              <h2 className="font-bold text-lg lg:text-3xl ">Adresses</h2>
              <AddNewAddress userId={Number(user.data?.id)} trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-cyan-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add New Address</span>
              </button>
              } />
            </div>
            
            {user.data?.addresses ? (<div className='w-full flex flex-wrap'>
                {user.data.addresses.map((address, idx)=>{
                  const num = idx + 1
                  return <div key={address.id} className='p-1 w-full sm:p-2 sm:w-1/2 lg:w-1/3'>
                    <div className='relative flex flex-col rounded-lg p-4 border space-y-4'>
                      <EditNewAddress id={Number(user.data.id)} address={address} addressId={address.id}  trigger={
                        <Button variant={"ghost"} className='absolute right-2 top-2 text-emerald-300 hover:text-emerald-700'>
                          <Edit />
                        </Button>}/>
                      <h5 className='font-bold text-xl'>Address {num}</h5>
                      <p>{address.addressLineOne}</p>
                      {address.addressLineTwo && <p>{address.addressLineTwo}</p>}
                      {address.landmark && <p>Near: {address.landmark}</p>}
                      <p>{address.city} . {address.state} . {address.country}</p>
                    </div>
                  </div>
                })}
              </div>) 
            : 
            
              (<div className='h-36 flex flex-col rounded-lg bg-gray-200 mt-4 items-center justify-center'>
                <h5 className='text-xs'>No address yet!!!</h5>
                <p>You can start by adding a new address.</p>
              </div>)
            }
            
          </div>
        </div>
        </div>
    )
}

export default UserProfile
