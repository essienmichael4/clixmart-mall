import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Product } from "@/lib/types"

import EditForm from "./EditForm"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

const EditProduct = () => {
    const {store, id} = useParams()
    const axios_instance_token = useAxiosToken()
    const navigate = useNavigate()
    
    const {data, isLoading} = useQuery<Product>({
        queryKey: ["products", store, id],
        queryFn: async() => await axios_instance_token.get(`/products/store/${store}/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })
    
    return (
        <>  
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-8 h-8 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href={`/products/${store}`} className="text-xs">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-xs">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbLink href={`/${id}`} className="text-xs">{id}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs">Edit</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                {isLoading ? <p>Loading</p> : <EditForm store={store as string} id={id as string} product={data as Product} />}
            </div>
        </>
    )
}

export default EditProduct
