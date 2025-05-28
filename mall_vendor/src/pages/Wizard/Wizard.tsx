import logo from '@/assets/logo.png'
import { Separator } from '@/components/ui/separator'
import useAuth from '@/hooks/useAuth'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Store } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const Wizard = () => {
    const axios_instance_token = useAxiosToken()
    const {auth} = useAuth()

    const stores = useQuery<Store[]>({
        queryKey: ["stores"],
        queryFn: async() => await axios_instance_token.get(`/stores/all`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    return (
        <div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto w-full flex-col items-center justify-between gap-4 pb-12'>
                <div className="mt-8">
                    <img src={logo} alt="logo" className='w-24'/>    
                </div>
                <div>
                    <h1 className='text-center text-3xl'> Welcome, <span className='ml-2 font-bold capitalize'>{auth?.name}</span></h1>
                    <h2 className="text-center mt-4 text-base text-muted-foreground">Let &apos;s get started by setting up your stores.</h2>
                    <h3 className="text-center text-sm text-muted-foreground mt-2">You can add and edit your stores at any time</h3>
                </div>
                <Separator />
                <div className='w-full'>
                    <h3 className='text-center mb-4 text-lg'>Your Stores</h3>
                    <div className='w-full flex flex-wrap justify-center'>
                        <Link to="/create" className='w-full sm:w-1/2 lg:w-1/3 p-4'>
                            <div className='border h-full p-4 rounded-md flex items-center justify-center gap-4 hover:bg-gray-100'>
                                <Plus className='w-5 h-5'/> Add New Store
                            </div>
                        </Link>
                        {stores.data?.map(store => (
                            <div key={store.id} className='w-full sm:w-1/2 lg:w-1/3 p-4'>
                                <div className={`${store.storeReview?.status === "APPROVED" && 'border-emerald-500'} ${store.storeReview?.status === "REJECTED" && 'border-rose-500'} border p-4 rounded-md flex gap-2 hover:bg-gray-100`}>
                                    {store.imageUrl && <div className='aspect-square w-20 rounded-lg overflow-hidden'>
                                        <img src={store.imageUrl} className='w-full h-full' alt="" />
                                    </div>}
                                    <div>
                                        <h4 className='text-xs font-semibold'>Store name</h4>
                                        <p className='capitalize'>{store.name}</p>

                                        <div className='flex gap-2 mt-2'>
                                            {store.storeReview?.status === "APPROVED" && <Link to={`/dashboard/${store.slug}`} className='text-xs text-blue-700'>Manage</Link>}
                                            <Link to={`/edit/${store.slug}/${store.id}`} className='text-xs text-emerald-700'>Edit</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* <Card className='w-full'>
                    <CardHeader >
                    <CardTitle>Your Stores</CardTitle>
                    <CardDescription>Create a new store or choose a store to manage.</CardDescription>
                    </CardHeader>
                    <CardContent  className='flex w-full'>
                    <div>
                        hi
                    </div>
                    <div>
                        hi
                    </div>
                    <div>
                        hi
                    </div>
                    </CardContent>
                </Card> */}
                <Separator />
                {/* <Button className='w-full' onClick={form.handleSubmit(onCurrencySetup)}>
                    {!isPending && "I'm done! Take me to the dashboard"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button> */}

            </div>
        </div>
    )
}

export default Wizard
