import { useState } from "react"
import logo from '@/assets/logo.png'
import { Store } from "@/lib/types"
import { useParams } from "react-router-dom"
import EditStoreInformation from "./EditStoreInformation"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import EditStoreDetails from "./EditStoreDetails"
import EditStoreAddress from "./EditStoreAddress"
import EditStorePaymentInfo from "./EditStorePaymentInfo"
import EditStoreNextOfKinDetails from "./EditStoreNextOfKinDetails"

const EditStore = () => {
    const [formStep, setFormStep] = useState(0)
    const {id} = useParams()
    const axios_instance_token = useAxiosToken()

    const {data, isLoading} = useQuery<Store>({
        queryKey: ["stores", id],
        queryFn: async() => await axios_instance_token.get(`/stores/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    return (
        <div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto w-full flex-col items-center justify-between gap-4 px-4'>
                <div className="mt-8">
                    <img src={logo} alt="logo" className='w-24'/>    
                </div>
                <h2 className="text-center text-3xl mt-4 text-muted-foreground">Let &apos;s get your store up an running.</h2>
                {isLoading ? <p>Loading</p> :<> {formStep === 0 && <EditStoreInformation store={data} id={Number(id)} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 1 && <EditStoreDetails store={data} id={Number(id)} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 2 && <EditStoreAddress store={data} id={Number(id)} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 3 && <EditStorePaymentInfo store={data} id={Number(id)} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 4 && <EditStoreNextOfKinDetails store={data} id={Number(id)} formStep={formStep} setFormStep={setFormStep} />}
                </>}
            </div>
        </div>
    )
}

export default EditStore
