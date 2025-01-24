import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({allowedRoles}:{allowedRoles:string[]}) => {
    const {auth} = useAuth()
    const location = useLocation()

  return (
    allowedRoles.includes(auth?.role as string) ? <Outlet /> : 
      auth?.id ? <Navigate to={"../unauthorized"} state={{from: location}} replace /> : 
      <Navigate to='../' state={{from: location}} replace/>
  )
}

export default RequireAuth
