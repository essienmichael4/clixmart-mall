import { Link, Outlet, useLocation } from "react-router-dom"

const Users = () => {
    const location = useLocation();
  
    return (
        <>
            <div className="container px-4 mx-auto">
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Link
                            to="/users"
                            className={`text-xs ${location.pathname === "/users" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                        >
                            Users
                        </Link>
                        <Link
                            to="/users/departments"
                            className={`text-xs ${location.pathname.includes("/users/departments") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                        >
                            Departments
                        </Link> 
                    </div>
                    <Outlet />
            </div>
        </>
    )
}

export default Users
