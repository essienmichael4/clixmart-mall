import { useState } from "react";
import { Calendar, DollarSign } from "lucide-react";
import clsx from "clsx";
import { useLedger } from "@/hooks/useLedger"; 
import type { Ledger } from "@/lib/types";
import { startOfMonth, endOfDay } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function Ledger() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
});

  const { ledger, meta, isLoading, isFetching, hasNextPage, hasPreviousPage } =
    useLedger(page, limit, dateRange.from, dateRange.to);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <div className="mx-auto relative">
        <div className="flex flex-wrap gap-3 mb-5 items-center p-3 rounded-lg border">
            {/* Search */}
            {/* <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200"
            />
            </div> */}


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
            {/* <button
            onClick={() => {
                setSearch("");
                setDateRange({
                from: startOfMonth(new Date()),
                to: endOfDay(new Date()),
                });
            }}
            className="text-xs text-gray-500 underline ml-auto"
            >
            Clear filters
            </button> */}
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
                <tr>
                <th className="py-2 px-3 text-left">Period</th>
                <th className="py-2 px-3 text-left">Commission</th>
                <th className="py-2 px-3 text-left">Tax</th>
                <th className="py-2 px-3 text-left">Shipping</th>
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
                ) : ledger && ledger.length === 0 ? (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                    No ledger records found.
                    </td>
                </tr>
                ) : (
                ledger?.map((entry: Ledger, i: number) => (
                    <tr
                    key={`${entry.year}-${entry.month}-${entry.day}-${i}`}
                    className={clsx(
                        "border-b transition-colors",
                        "hover:bg-gray-50"
                    )}
                    >
                    <td className="py-2 px-3 font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {entry.day}/{entry.month}/{entry.year}
                    </td>
                    <td className="py-2 px-3 text-green-600 font-medium flex items-center gap-1">
                        <DollarSign size={14} />
                        {parseFloat(entry.totalCommission).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-blue-600 font-medium">
                        {parseFloat(entry.totalTax).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-yellow-600 font-medium">
                        {parseFloat(entry.totalShipping).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

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
