import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { axios_instance } from "@/api/axios";

const useCategories = () => {
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async() => await axios_instance.get(`/categories`).then(res => {
            return res.data
        })
    })

    return {categories: categoriesQuery.data}
}

export default useCategories
