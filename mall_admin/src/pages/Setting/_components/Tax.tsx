import { Skeleton } from "@/components/ui/skeleton";
import useAxiosToken from "@/hooks/useAxiosToken"
import { Tax } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import CreateTax from "./CreateTax";
import UpdateTax from "./UpdateTax";

const TaxComponent = () => {
    const axios_instance_token = useAxiosToken()

    const {data:tax, isLoading} = useQuery<Tax>({
        queryKey: ["tax"],
        queryFn: async() => await axios_instance_token.get(`/settings/tax`).then(res => {
            return res.data
        })
    })

    return (
        <div className="my-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">Tax</h3>
                    <p className="text-xs text-muted-foreground">This is the current tax on all products ordered by users.</p>
                </div>
                {isLoading ? <Skeleton><div className="h-8 w-12"></div></Skeleton> : 
                    !tax && <CreateTax trigger={<button className="text-xs text-white py-2 px-4 rounded bg-cyan-700">Add Tax</button>} />
                }
            </div>
            <div className="text-5xl mt-4 flex justify-between items-center">
                {isLoading ? <Skeleton><div className="h-8 w-12"></div></Skeleton> : 
                    tax && <h4>{tax.taxPercent}%</h4>
                }
                {isLoading ? <Skeleton><div className="h-8 w-12"></div></Skeleton> : 
                    tax && <UpdateTax trigger={<button className="text-xs text-white py-2 px-4 rounded bg-emerald-700">Update Tax</button>} tax={tax} />
                }
            </div>
        </div>
    )
}

export default TaxComponent
