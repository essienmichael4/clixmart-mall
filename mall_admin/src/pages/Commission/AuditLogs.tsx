import { useState } from "react";
import { Search, AlertTriangle, CheckCircle2, X, FileJson, Filter } from "lucide-react";
import clsx from "clsx";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth, endOfDay } from "date-fns";

import { useAuditLogs } from "@/hooks/useAuditLogs";
import type { AuditLog } from "@/lib/types";

const ACTION_OPTIONS = [
  "ALL",
  "PAYOUT_INITIATED",
  "PAYOUT_COMPLETED",
  "PAYOUT_FAILED",
  "REVENUE_PROCESSED",
  "REVENUE_PROCESS_FAILED",
  "COMMISSION_PROCESSED",
  "STORE_UPDATED",
];

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const {
    logs,
    meta,
    isLoading,
    isFetching,
    hasNextPage,
    hasPreviousPage,
  } = useAuditLogs(page, limit, search, dateRange.from, dateRange.to, actionFilter);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <div className="mx-auto relative">
      <div className="flex justify-between items-center mb-0">
        {isFetching && (
          <span className="text-xs text-gray-400 animate-pulse">
            Updating...
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center bg-gray-50 p-3 rounded-lg border">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={16} />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {ACTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={({ range: { from, to } }) => {
            if (!from || !to) return;
            // if (differenceInDays(to, from) > 90) {
            //   toast.error("The selected date range is too large. Max 90 days allowed.");
            //   return;
            // }
            setDateRange({ from, to });
          }}
        />

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearch("");
            setActionFilter("ALL");
            setDateRange({
              from: startOfMonth(new Date()),
              to: endOfDay(new Date()),
            });
          }}
          className="text-xs text-gray-500 underline ml-auto"
        >
          Clear filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-left">Action</th>
              <th className="py-2 px-3 text-left">Context</th>
              <th className="py-2 px-3 text-left">Performed By</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : !logs?.length ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelected(log)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-medium text-gray-700">
                    {log.action}
                  </td>
                  <td className="py-2 px-3 truncate max-w-xs">{log.context || "—"}</td>
                  <td className="py-2 px-3">{log.performedBy?.name || "System"}</td>
                  <td className="py-2 px-3">
                    {log.isError ? (
                      <span className="flex items-center text-red-500">
                        <AlertTriangle size={16} className="mr-1" />
                        Failed
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 size={16} className="mr-1" />
                        Success
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          Page {meta?.page || page} of {meta ? Math.ceil(meta.itemCount / limit) : 1}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Drawer */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto",
          selected ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Log Details</h2>
          <button
            onClick={() => setSelected(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {selected && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm text-gray-500 uppercase">Action</h3>
              <p className="font-medium">{selected.action}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase">Context</h3>
              <p>{selected.context || "—"}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase">Performed By</h3>
              <p>{selected.performedBy?.name || "System"}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase">Status</h3>
              <p
                className={clsx(
                  "inline-flex items-center px-2 py-1 rounded text-xs font-semibold",
                  selected.isError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {selected.isError ? "Failed" : "Success"}
              </p>
            </div>

            {selected.isError && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Error</h3>
                <p className="text-red-600 whitespace-pre-wrap">
                  {selected.errorMessage}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm text-gray-500 uppercase flex items-center gap-1">
                <FileJson size={14} /> Data
              </h3>
              <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-60">
                {JSON.stringify(selected.data, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase">Created</h3>
              <p>{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelected(null)}
        ></div>
      )}
    </div>
  );
}
