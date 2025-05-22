import { Link } from 'react-router-dom'
import elctronics from '@/assets/elec.jpg'
import phones from '@/assets/phones.jpg'
import computing from '@/assets/computing3.jpg'
import kids from '@/assets/kids.jpg'
import fashion from '@/assets/fashion1.jpg'
import appliance from '@/assets/appliance.jpg'
import home from '@/assets/home1.jpg'
import gaming from '@/assets/gaming.jpg'
import gym from '@/assets/gym.jpg'
import groceries from '@/assets/groceries.jpg'

const StaticCategories = () => {
  return (
    <div className='w-full flex flex-wrap'>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/phones-&-tablets'} className='w-full h-full '>
                    <img src={phones} alt="" className='h-full w-full' />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Phone Deals</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/electronics'} className='w-full h-full '>
                    <img src={elctronics} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Electronics</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/computing'} className='w-full h-full '>
                    <img src={computing} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Computing</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/appliances'} className='w-full h-full '>
                    <img src={appliance} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Appliance</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/baby-&-kids'} className='w-full h-full '>
                    <img src={kids} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>For Kid's</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/home-&-office'} className='w-full h-full '>
                    <img src={home} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Home & Office</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/fashion-&-beauty'} className='w-full h-full '>
                    <img src={fashion} className='h-full w-full' alt="" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Fashion</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/games-&-sporting'} className='w-full h-full '>
                    <img src={gaming} className='h-full w-full' alt="Person Holding White and Black Xbox One Game Controller" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Gaming</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/health-&-safety?sub-categories=9f740929-39b8-4170-9c88-c842def0f41e'} className='w-full h-full '>
                    <img src={gym} className='h-full w-full' alt="Exercise Equipment at a Gym" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Gym Equipements</p>                    
                </div>
            </div>
        </div>
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-square'>
            <div className='w-full h-full overflow-hidden rounded-lg relative'>    
                <Link to={'categories/supermarket'} className='w-full h-full '>
                    <img src={groceries} className='h-full w-full' alt="Happy Woman Buying Groceries in a Convenience Store" />
                </Link>
                <div className='absolute bottom-0 right-0 left-0 p-2 bg-black/70'>
                    <p className='text-sm md:text-xl font-semibold text-white text-center'>Groceries</p>                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default StaticCategories
