import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { AccountLedger, Data } from "@/lib/types";

export const useAccountsLedger = (
  page: number,
  limit: number,
  accountId?: number,
  search?: string,
  type?: string,
  from?: Date,
  to?: Date
) => {
  const axios_instance_token = useAxiosToken();

  const ledgerQuery = useQuery<Data>({
    queryKey: ["ledger", page, limit, accountId, search, type, from, to],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/commissions/accounts-ledger`, {
        params: {
          page,
          take: limit,
          accountId,
          search: search || undefined,
          type: type !== "ALL" ? type : undefined,
          from: from?.toISOString(),
          to: to?.toISOString(),
        },
      });
      return res.data;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });

  const ledger = ledgerQuery.data?.data as AccountLedger[] | undefined;
  const meta = ledgerQuery.data?.meta;

  return {
    ledger: ledger,
    meta: meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: ledgerQuery.isLoading,
    isFetching: ledgerQuery.isFetching,
    error: ledgerQuery.error,
  };
};
