import { axios_instance } from "@/api/axios";
import MainCarousel from "./Carousel/MainCarousel"
import { useQuery } from "@tanstack/react-query";
import { Banner } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import DynamicCarousel from "./Carousel/DynamicCarousel";

const Billboard = () => {
  const {data:banners, isLoading} = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async() => await axios_instance.get(`/settings/banners`).then(res => {
      console.log(res.data);
      
      return res.data
    })
  })

  const content = isLoading ? <Skeleton>
      <div className="sm:h-72 md:h-80 lg:h-96 w-full">

      </div>
  </Skeleton> : banners ? <div className="sm:h-72 md:h-80 lg:h-96 flex-1 aspect-video rounded-lg overflow-hidden">
      <DynamicCarousel banners={banners} />
  </div> : <div>
    <MainCarousel />
  </div>

  return content
}

export default Billboard