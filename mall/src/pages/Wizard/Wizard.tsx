import logo from '@/assets/logo.png'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAuth from '@/hooks/useAuth'
import Contact from '@/components/Contact'
import { useState } from 'react'
import AddAddress from '../User/AddAddress'

const Wizard = () => {
    const [formStep, setFormStep] = useState(0)
    const {auth} = useAuth()

    return (
        <div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto w-full flex-col items-center justify-between gap-4 pb-12'>
                
                <div className='mt-8'>
                    <h1 className='text-center text-3xl'> Welcome, <span className='ml-2 font-bold capitalize'>{auth?.name}</span></h1>
                    <h2 className="text-center mt-4 text-base text-muted-foreground">Let &apos;s get started by finishing up your account.</h2>
                    <h3 className="text-center text-sm text-muted-foreground mt-2">You can change these details at any time.</h3>
                </div>
                <Separator />
                <div className='w-full flex items-center justify-center'>
                    {formStep === 0 && 
                        <Card className=''>
                            <CardHeader >
                            <CardTitle className='text-2xl'>Phone</CardTitle>
                            <CardDescription>Set your default contact</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Contact formStep={formStep} id={auth?.id} setFormStep={setFormStep}/>
                            </CardContent>
                        </Card>
                        }
                    {formStep === 1 && <AddAddress id={auth?.id} formStep={formStep} setFormStep={setFormStep} />}
                </div>
                <Separator />
                <div className="mt-8 flex items-center">
                    <img src={logo} alt="logo" className='w-12'/>  <span className='text-3xl font-bold leading-tight tracking-tighter'>Clixmart</span>  
                </div>
            </div>
        </div>
    )
}

export default Wizard
