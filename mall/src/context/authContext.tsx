import { AuthType } from "@/lib/types";
import { createContext, useEffect, useReducer } from "react";

interface Action {
    type: "ADD_AUTH" | "REMOVE_AUTH",
    payload?: AuthType
}

interface IContextProps {
    auth: AuthType | undefined,
    dispatch: ({type, payload}:Action) => void
}

export const AuthContext = createContext({} as IContextProps)

export const AuthReducer = (state: AuthType | undefined, action: Action) =>{
    switch(action?.type){
        case "ADD_AUTH":
            return action.payload
        case "REMOVE_AUTH":
            return undefined
        default:
            return state
    }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [auth, dispatch] = useReducer(AuthReducer, undefined, ()=>{
        const localData = sessionStorage.getItem("auth")
        return localData ? JSON.parse(localData) : undefined
    })
    useEffect(()=>{
        auth != undefined ? sessionStorage.setItem("auth", JSON.stringify(auth)) : sessionStorage.removeItem("auth")
    }, [auth])

    return (
            <AuthContext.Provider value={{ auth, dispatch }}>
                {children}
            </AuthContext.Provider>
        )
}

export default AuthProvider
