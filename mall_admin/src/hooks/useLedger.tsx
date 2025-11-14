import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data, Ledger } from "@/lib/types";

/**
 * Custom React Query hook for fetching ledger (AccountMonthHistory).
 */
export const useLedger = (page: number, limit: number, from?: Date, to?: Date) => {
  const axios_instance_token = useAxiosToken();

  const ledgerQuery = useQuery<Data>({
    queryKey: ["ledger", page, limit, from, to],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/commissions/history-ledger`, {
        params: {
          page,
          take: limit,
          from: from?.toISOString(),
          to: to?.toISOString(),
        },
      });
      return res.data;
    },
    placeholderData: (prev) => prev, // keep previous data for smooth pagination
    staleTime: 1000 * 60, // cache for 1 minute
  });

  const ledger = ledgerQuery.data?.data as Ledger[] | undefined;
  const meta = ledgerQuery.data?.meta;

  return {
    ledger,
    meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: ledgerQuery.isLoading,
    isFetching: ledgerQuery.isFetching,
    error: ledgerQuery.error,
  };
};
