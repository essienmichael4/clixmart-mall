import { useState } from "react"
import logo from '@/assets/logo.png'
import StoreDetails from "@/components/StoreDetails"
import StoreInformation from "@/components/StoreInformation"
import StoreAddress from "@/components/StoreAddress"
import StorePaymentInfo from "@/components/StorePaymentInfo"
import StoreNextOfKinDetails from "@/components/StoreNextOfKinDetails"
import { Store } from "@/lib/types"

const CreateStore = () => {
    const [formStep, setFormStep] = useState(0)
    const [store, setStore] = useState<Store | undefined>()

    return (
        <div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto w-full flex-col items-center justify-between gap-4 px-4'>
                <div className="mt-8">
                    <img src={logo} alt="logo" className='w-24'/>    
                </div>
                <h2 className="text-center text-3xl mt-4 text-muted-foreground">Let &apos;s get your store up an running.</h2>
                {formStep === 0 && <StoreInformation store={store} setStore={setStore} setFormStep={setFormStep} />}
                {formStep === 1 && <StoreDetails store={store} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 2 && <StoreAddress store={store} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 3 && <StorePaymentInfo store={store} formStep={formStep} setFormStep={setFormStep} />}
                {formStep === 4 && <StoreNextOfKinDetails store={store} formStep={formStep} setFormStep={setFormStep} />}
            </div>
        </div>
    )
}

export default CreateStore
