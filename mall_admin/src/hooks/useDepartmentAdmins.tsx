import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data, User } from "@/lib/types";

/**
 * Custom React Query hook for fetching department users.
 */
export const useDepartmentAdmins = (id:number, page: number, limit: number, search?:string) => {
  const axios_instance_token = useAxiosToken();

  const departmentQuery = useQuery<Data>({
    queryKey: ["departments", id, "users", page, limit, search],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/departments/${id}`, {
        params: {
          page,
          take: limit,
          search,
        },
      });
      return res.data;
    },
    placeholderData: (prev) => prev, // keep previous data for smooth pagination
    staleTime: 1000 * 60, // cache for 1 minute
  });

  const users = departmentQuery.data?.data as User[] | undefined;
  const meta = departmentQuery.data?.meta;

  return {
    users,
    meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: departmentQuery.isLoading,
    isFetching: departmentQuery.isFetching,
    error: departmentQuery.error,
  };
};
