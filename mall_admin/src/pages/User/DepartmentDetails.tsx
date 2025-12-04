import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Department,  } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import DepartmentUsers from "./_components/DepartmentUsers"

const DepartmentDetails = () => {
    const navigate = useNavigate()
    const {id} =useParams()
    const axios_instance_token = useAxiosToken()

    const departmentQuery = useQuery<Department>({
        queryKey: ["departments", id],
        queryFn: async() => await axios_instance_token.get(`/department/${id}`).then(res => {
            return res.data
        })
    })

    return (
        <div className='mx-auto container mt-4 mb-16 px-4'>
            <div  className="mt-4 flex relative items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-6 h-6 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="../departments" className="text-xs">Departments</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">Department Details</h2>
                <div className="bg-white border shadow-sm rounded-lg p-6"> 
                    <div className="mb-4">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Department Name</h3>
                        <p className="text-md font-semibold">{departmentQuery.data?.name}</p>
                    </div>
                    <div className="flex mb-4 gap-4">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Description</h3>
                            <p className="text-sm">{departmentQuery.data?.description}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Day Created</h3>
                            <p className="text-sm">{new Date(departmentQuery.data?.createdAt as string).toDateString()}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Day Updated</h3>
                            <p className="text-sm">{new Date(departmentQuery.data?.updatedAt as string).toDateString()}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="mt-4">
                        <h3 className="text-xs font-semibold mb-2">Users in this Department</h3>
                        <p className="text-xs text-gray-500">List of users assigned to this department will be displayed here.</p>
                    </div>
                    <div>
                        {/* Users list table can be implemented here */}
                        {departmentQuery.data && <DepartmentUsers departmentId={departmentQuery.data.id} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepartmentDetails
