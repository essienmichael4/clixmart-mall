import logo from '@/assets/logo.png'
import { Mail, MapPin } from 'lucide-react'
import { Separator } from './ui/separator'

const Footer = () => {
  return (
    <div className='w-full bg-gray-300 pt-6'>
        <div className='container space-y-2 px-4 mx-auto my-12 '>
            <div className="flex justify-between">
                <div className='w-2/6'>
                    <div className='flex items-center gap-2'>
                        <img src={logo} alt="logo" className='h-5 w-5 lg:h-8 lg:w-8 mr-2' />
                        <span className="text-sm font-bold lg:text-lg tracking-tight">CLIXMART</span>
                    </div>
                    <p className='text-xs'>The perfect ecommerce platform for all <br /> your business needs.</p>
                </div>
                <div className='w-1/6'>
                    <h3 className='font-bold text-sm mb-2'>Company</h3>
                    <div className='space-y-2'>
                        <p className='text-xs'>Our story</p>
                        <p className='text-xs'>Careers</p>
                        <p className='text-xs'>Privacy policy</p>
                        <p className='text-xs'>Terms & conditions</p>
                        <p className='text-xs'>Latest news</p>
                        <p className='text-xs'>Couriers</p>
                    </div>
                </div>
                <div className='w-1/6'>
                    <h3 className='font-bold text-sm mb-2'>Customers</h3>
                    <div className='space-y-2'>
                        <p className='text-xs'>Log in</p>
                        <p className='text-xs'>Register</p>
                        <p className='text-xs'>Contact us</p>
                        <p className='text-xs'>Support hub</p>
                        <p className='text-xs'>Prefrences</p>
                        <p className='text-xs'>Buy RMB</p>
                        <p className='text-xs'>CSL Shipping</p>
                    </div>
                </div>
                <div className='w-1/6'>
                    <h3 className='font-bold text-lg mb-2'> Talk to us</h3>
                    <div>
                        <p className='text-xs'>Got Questions? call us</p>
                        <p className='font-bold mb-2'>+233 552 771 004</p>
                        <div className='flex gap-2 mb-2 items-center'>
                            <Mail className='w-4 h-4'/><p className='text-xs'>clixmartonline@gmail.com</p>
                        </div>
                        <div className='flex gap-2'>
                            <MapPin className='w-4 h-4'/>
                            <p className='text-xs'>First Storey Building on the Right <br />
                                Tabora Junction Bus Stop - Alaji Road <br />
                                Accra, Ghana
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Separator />
        <div className='container space-y-2 px-4 lg:px-0 mx-auto mt-8 pb-8'>
            <div className="flex justify-between">
                <p className="text-xs text-gray-500">Copyright © 2025 Clixmart Group | All Rights Reserved</p>
                <div className='flex gap-8 '>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
