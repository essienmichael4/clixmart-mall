import { Link, Outlet, useLocation } from "react-router-dom";

const Statements = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="mt-4">
      <div className="flex gap-6 mb-4 pb-2">
        <Link
          to="/commissions/statements/history-ledger"
          className={`text-xs ${isActive("/commissions/statements/history-ledger") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          History Ledger
        </Link>
        <Link
          to="/commissions/statements/accounts-ledger"
          className={`text-xs ${isActive("/commissions/statements/accounts-ledger") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Account Ledger
        </Link>
        <Link
          to="/commissions/statements/audit-logs"
          className={`text-xs ${isActive("/commissions/statements/audit-logs") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Audit Logs
        </Link>
      </div>

      {/* nested pages */}
      <Outlet />
    </div>
  );
};

export default Statements;
