import { useState } from "react";
import { Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Search } from "lucide-react";
import clsx from "clsx";
import type { AccountLedger } from "@/lib/types";
import { startOfMonth, endOfDay } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useAccountsLedger } from "@/hooks/useAccountLedger";

export default function AccountLedgerPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
   const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });

  const { ledger, meta, isLoading, isFetching, hasNextPage, hasPreviousPage } =
    useAccountsLedger(page, limit, undefined, search, type, dateRange.from, dateRange.to);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <div className="mx-auto relative">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center p-3 rounded-lg border">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reference or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-2 border rounded-md text-sm focus:ring focus:ring-indigo-200"
            />
          </div>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="border rounded-md px-2 py-2 text-sm"
          >
            <option value="ALL">All Types</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </select>

        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={({ range: { from, to } }) => {
            if (!from || !to) return;
            setDateRange({ from, to });
          }}
        />
          
        </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Type</th>
              <th className="py-2 px-3 text-left">Amount</th>
              <th className="py-2 px-3 text-left">Balance After</th>
              <th className="py-2 px-3 text-left">Description</th>
              <th className="py-2 px-3 text-left">Reference</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : ledger && ledger.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No ledger records found.
                </td>
              </tr>
            ) : (
              ledger?.map((entry: AccountLedger) => (
                <tr
                  key={entry.id}
                  className={clsx(
                    "border-b transition-colors",
                    "hover:bg-gray-50"
                  )}
                >
                  <td className="py-2 px-3 text-gray-600 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={clsx(
                      "py-2 px-3 font-semibold flex items-center gap-1",
                      entry.type === "CREDIT"
                        ? "text-green-600"
                        : "text-red-500"
                    )}
                  >
                    {entry.type === "CREDIT" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {entry.type}
                  </td>
                  <td
                    className={clsx(
                      "py-2 px-3 flex items-center gap-1 font-medium",
                      entry.type === "CREDIT"
                        ? "text-green-600"
                        : "text-red-500"
                    )}
                  >
                    <DollarSign size={14} />
                    {parseFloat(entry.amount.toString()).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-gray-700 font-semibold">
                    {parseFloat(entry.balanceAfter.toString()).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-gray-600">
                    {entry.description || "-"}
                  </td>
                  <td className="py-2 px-3 text-gray-500">
                    {entry.reference || "-"}
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
          Page {meta?.page || page} of{" "}
          {meta ? Math.ceil(meta.itemCount / limit) || 1 : 1}
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

      {isFetching && (
        <div className="absolute bottom-2 right-4 text-xs text-gray-400">
          Updating...
        </div>
      )}
    </div>
  );
}
