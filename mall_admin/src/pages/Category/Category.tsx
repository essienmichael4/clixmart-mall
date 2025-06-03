import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import useAxiosToken from "@/hooks/useAxiosToken";
import { Category } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"

const CategoryDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()

    const {data:category} = useQuery<Category>({
        queryKey: ["categories"],
        queryFn: async() => await axios_instance_token.get(`/categories/${id}`).then(res => {
        console.log(res.data);
        
        return res.data
        })
    })
    return (
        <div>
            <div  className="mt-4 mx-4 space-y-8 relative gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-6 h-6 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="../Dashboard" className="text-xs">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="../products" className="text-xs">Categories</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs">{category?.categoryId}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <div className="flex items-center gap-4">
                        <div className="aspect-square w-12 h-12 rounded-lg overflow-hidden">
                            <img src={category?.imageUrl} className="w-full h-full " alt="" />
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-400 font-bold">Category name</h4>
                            <p className="text-lg capitalize">{category?.name}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="my-4 text-xl">Sub-Categories</h3>
                    <div className="space-y-2">
                        {category?.subCategories?.map(sub=>{
                            return (
                                <div key={sub.id} className="py-4 px-2 border rounded-lg">
                                    <div className="flex gap-4 items-center">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400">Sub-Category name</h4>
                                            <p className="capitalize">{sub.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400">Created At</h4>
                                            <p className="capitalize">{new Date(sub.createdAt).toDateString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {sub?.secondLevelSubCategories?.map(secendLevelSub => {
                                            return (
                                                <div className="ml-8 p-4 border rounded-md" key={secendLevelSub.id}>
                                                    <div className="flex gap-4 items-center">
                                                        <div>
                                                            <h4 className="text-xs font-semibold text-gray-400">Second Level Sub-Category name</h4>
                                                            <p className="capitalize">{secendLevelSub.name}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-semibold text-gray-400">Created At</h4>
                                                            <p className="capitalize">{new Date(secendLevelSub.createdAt).toDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {secendLevelSub?.thirdLevelSubCategories?.map(thirdLevelSub => {
                                                            return (
                                                                <div className="ml-8" key={thirdLevelSub.id}>
                                                                    <div>
                                                                        <div>
                                                                            <h4 className="text-xs font-semibold text-gray-400">Third Level Sub-Category name</h4>
                                                                            <p className="capitalize">{thirdLevelSub.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryDetails
