import { Link, Outlet } from "react-router-dom"


const Commissions = () => {
  return (
    <>
        <div className="container w-full mx-auto mt-4 px-4">
            <div className="flex flex-wrap gap-4 mb-2">
                <Link to={'/commissions'} className="text-xs text-gray-500">Commisions</Link>
                <Link to={'/commissions/transactions'} className="text-xs text-gray-500">Transactions</Link>
                <Link to={'/commissions/vendor-payouts'} className="text-xs text-gray-500">Payouts</Link>
                <Link to={'/commissions/statements'} className="text-xs text-gray-500">Accounts & Statements</Link>
            </div>
            <Outlet />
        </div>
    </>
  )
}

export default Commissions
