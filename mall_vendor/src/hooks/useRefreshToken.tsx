import { AuthType } from '@/lib/types'
import useAuth from './useAuth'
import axios from 'axios'

const useRefreshToken = () => {
    const {auth, setAuth} = useAuth()

    const refresh = async ()=>{
        const response = await axios.get(`"https://api.cslfreightgh.com/auth/refresh`, {
            headers: {
                'Authorization': `Refresh ${auth?.backendTokens.refreshToken}`
            }
        })

        setAuth(prev =>{
            const auth:AuthType = {
                id: prev?.id,
                role: prev?.role,
                name: prev!.name,
                email: prev!.email, 
                backendTokens: {
                    accessToken: response.data?.accessToken,
                    refreshToken: prev!.backendTokens.refreshToken
                }
            }
            return auth
        })
        
        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken
