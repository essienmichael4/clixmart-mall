import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import maintenance from '../../assets/pexels-kindelmedia-7007188.jpg'

const items = [
    <div className="item w-full h-full" data-value="1">
        <img src={maintenance} className='w-full h-full' alt="" />
    </div>
];

const MainCarousel = () => (
    <div className='w-full h-full'>
        <AliceCarousel
            mouseTracking
            items={items}
            disableButtonsControls
            disableDotsControls
            autoPlay
            autoPlayInterval={10000}
            infinite
            />
    </div>
)

export default MainCarousel
