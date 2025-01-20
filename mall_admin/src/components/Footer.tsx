import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className='py-8 bg-[#ff9d00] mt-20 px-4'>
        <div className='container mx-auto text-white'>
            <div className='flex flex-col md:flex-row md:justify-between items-start'>
                <div >
                    <div className='flex'>
                        <h2 className='text-2xl md:text-4xl pr-2 md:pr-4 '>New Edge Marine Services</h2>
                    </div>
                    <div className="mt-8 space-y-4">
                        <p>kojosavage@ymail.com</p>
                        <p>(+233) 24 366 0662</p>
                    </div>
                    <div className="mt-4 italic flex flex-col gap-2">
                        <p>Sakumono Vllage</p>
                        <p>Off Railway Line</p>
                        <p>Tema - Accra, Ghana</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                    <div className='flex'>
                        <h2 className='text-2xl md:text-4xl pr-2 md:pr-4 '>Our Services</h2>
                    </div>
                    <div className="mt-8 space-y-4">
                        <p>Dry Cleaning</p>
                        <p>Chemical Washing</p>
                    </div>
                    <div className='flex'>
                        <Link to={"/gallery"} className='text-2xl md:text-4xl pr-2 md:pr-4 '>Our Stories</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                    <div className='flex'>
                        <Link to={"/contact"} className='text-2xl md:text-4xl pr-2 md:pr-4 '>Contact Us</Link>
                    </div>
                    
                </div>
            </div>
            <div className='mt-8 flex items-center justify-between border-t pt-4 flex-col sm:flex-row gap-4'>
                <p className="text-xs">© 2024 New Edge Group. All rights reserved</p>
                <div className='flex gap-8 '>
                    <p className="text-xs">Privacy Policy</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
