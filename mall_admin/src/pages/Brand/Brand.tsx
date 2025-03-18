import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Brand } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"

const BrandDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const axios_instance_token = useAxiosToken()

  const brandQuery = useQuery<Brand>({
      queryKey: ["brands", id],
      queryFn: async() => await axios_instance_token.get(`/brands/${id}`).then(res => {
          console.log(res.data);
          
          return res.data
      })
  })
  return (
    <div>
      <div  className="mt-4 mx-4 flex relative items-center justify-between gap-4">
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
                  <BreadcrumbLink href="../products" className="text-xs">Brands</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-xs"/>
                  <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs">{brandQuery.data?.id}</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  )
}

export default BrandDetails
