import { Link, Outlet, useLocation } from "react-router-dom";

const Commissions = () => {
  const location = useLocation();

  return (
    <div className="container w-full mx-auto mt-4 px-4">
      <div className="flex flex-wrap gap-4 mb-2">
        <Link
          to="/commissions"
          className={`text-xs ${location.pathname === "/commissions" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Commissions
        </Link>
        <Link
          to="/commissions/transactions"
          className={`text-xs ${location.pathname.includes("/commissions/transactions") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Transactions
        </Link>
        <Link
          to="/commissions/vendor-payouts"
          className={`text-xs ${location.pathname.includes("/commissions/vendor-payouts") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Payouts
        </Link>
        <Link
          to="/commissions/statements"
          className={`text-xs ${location.pathname.includes("/commissions/statements") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Accounts & Statements
        </Link>
      </div>

      {/* Render nested page content */}
      <Outlet />
    </div>
  );
};

export default Commissions;

