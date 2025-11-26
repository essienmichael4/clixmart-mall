import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data, Hub } from "@/lib/types";

/**
 * Custom React Query hook for fetching department users.
 */
export const useHubs = (page: number, limit: number, search?:string) => {
  const axios_instance_token = useAxiosToken();

  const hubsQuery = useQuery<Data>({
    queryKey: ["hubs", page, limit, search],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/hubs`, {
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

  const hubs = hubsQuery.data?.data as Hub[] | undefined;
  const meta = hubsQuery.data?.meta;

  return {
    hubs,
    meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: hubsQuery.isLoading,
    isFetching: hubsQuery.isFetching,
    error: hubsQuery.error,
  };
};
