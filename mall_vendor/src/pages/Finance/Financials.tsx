import { NavLink, Outlet } from "react-router-dom"

const Financials = () => {
  return (
    <div className="container w-full mx-auto mt-4 px-4">
      <h2 className="text-md font-semibold">Financial Activities</h2>

      <div className="h-32 rounded-md bg-slate-400 my-4">

      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-xs">
        <NavLink
          end
          to=""
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "text-black font-medium "
                : "text-gray-500"
            }`
          }
        >
          Sales
        </NavLink>

        <NavLink
          to="commissions"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "text-black font-medium "
                : "text-gray-500"
            }`
          }
        >
          Commissions
        </NavLink>

        <NavLink
          to="payouts"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "text-black font-medium "
                : "text-gray-500"
            }`
          }
        >
          Payouts
        </NavLink>
      </div>

      {/* Nested pages */}
      <div className=" py-2">
        <Outlet />
      </div>
    </div>
  )
}

export default Financials
