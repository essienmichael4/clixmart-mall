import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import maintenance from '../../assets/pexels-kindelmedia-7007188.jpg'
// import main from '../../assets/IMG_6806.jpg'

const items = [
    <div className="item w-full h-full" data-value="1">
        <img src={maintenance} className='w-full h-full' alt="" />
        {/* <img src={main} className='hidden sm:block w-full h-full object-cover' alt="" /> */}
    </div>,
    // <div className="item" data-value="2"></div>,
    // <div className="item" data-value="3"></div>,
    // <div className="item" data-value="4"></div>,
    // <div className="item" data-value="5"></div>,
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
            // responsive={responsive}
            // controlsStrategy="alternate"
            />
    </div>
)

export default MainCarousel
