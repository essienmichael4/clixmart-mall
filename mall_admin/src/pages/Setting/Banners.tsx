import useAxiosToken from "@/hooks/useAxiosToken";
import { Banner } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import DeleteBanner from "./DeleteBanner";

const Banners = () => {
    const axios_instance_token = useAxiosToken()

    const bannersQuery = useQuery<Banner[]>({
        queryKey: ["banners"],
        queryFn: async() => await axios_instance_token.get(`/settings/banners`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const dataAvailable = bannersQuery.data && bannersQuery.data.length > 0

    return (
        <>
        {dataAvailable && 
            <div className="w-full flex flex-wrap">
                {bannersQuery.data.map(banner=>{
                    return (<>    
                        <div key={banner.bannerId} className='w-full sm:w-1/2 lg:w-1/3 h-52 px-2 py-2 relative'>
                            <img src={banner.imageUrl} alt="banner image" className="h-full w-full rounded-lg overflow-hidden" />
                            <DeleteBanner id={banner.bannerId} trigger={<button className="absolute top-4 right-4 rounded-full p-1 bg-white"><Trash2 className="w-4 h-4 text-rose-800"/></button>} />
                        </div>
                    </>)
                })}
            </div>
        }
        {!dataAvailable && 
            <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
                No banners added yet
                <p className="text-sm text-center text-muted-foreground">Try adding a new banner</p>
            </div>
        }
        </>
    )
}

export default Banners
