import MainCarousel from "./Carousel/MainCarousel"

const Billboard = () => {
  return (
    <div className="sm:h-64 md:h-72 lg:h-96 flex-1 aspect-video bg-slate-500 rounded-lg overflow-hidden">
        <MainCarousel />
    </div>
  )
}

export default Billboard