import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { AuditLog, Data } from "@/lib/types";

/**
 * Custom React Query hook for fetching audit logs.
 */
export const useAuditLogs = (
  page: number,
  limit: number,
  search?: string,
  from?: Date,
  to?: Date,
  action?: string
) => {
  const axios_instance_token = useAxiosToken();

  const logsQuery = useQuery<Data>({
    queryKey: ["audit-logs", page, limit, search, from, to, action],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/commissions/audit-logs`, {
        params: {
          page,
          take: limit,
          search: search || undefined,
          from: from?.toISOString(),
          to: to?.toISOString(),
          action: action !== "ALL" ? action : undefined,
        },
      });
      return res.data;
    },
    placeholderData: (prev) => prev, // smooth pagination
    staleTime: 1000 * 30, // 30 seconds caching
  });

  const logs = logsQuery.data?.data as AuditLog[] | undefined;
  const meta = logsQuery.data?.meta;

  return {
    logs,
    meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: logsQuery.isLoading,
    isFetching: logsQuery.isFetching,
    error: logsQuery.error,
  };
};
