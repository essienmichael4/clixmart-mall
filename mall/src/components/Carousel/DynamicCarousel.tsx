import { Banner } from '@/lib/types';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface BannerProps {
    banners: Banner[]
}
const DynamicCarousel = ({banners}: BannerProps) => {
    const items = banners.map(banner=>{
        return <div key={banner.bannerId} className="item w-full h-full" data-value="1">
             <img src={banner.imageUrl} className='w-full h-full' alt="" />
        </div>
    })

    return (<div className='w-full h-full'>
        <AliceCarousel
            mouseTracking
            items={items}
            disableButtonsControls
            disableDotsControls
            autoPlay
            autoPlayInterval={10000}
            infinite
            />
    </div>)
}

export default DynamicCarousel
