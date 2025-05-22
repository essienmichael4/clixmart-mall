import MainCarousel from "./Carousel/MainCarousel"

const Billboard = () => {
  return (
    <div className="sm:h-72 md:h-80 lg:h-96 flex-1 aspect-video rounded-lg overflow-hidden">
        <MainCarousel />
    </div>
  )
}

export default Billboard