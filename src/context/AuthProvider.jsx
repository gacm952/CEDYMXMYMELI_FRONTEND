import { useState, useEffect, createContext } from "react";
import costumerAxios from "../config/costumerAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [allUsers, setAllUsers] = useState({})
    const [loading, setLoading] =useState(true)

    useEffect(() => {     
        const AuthUser = async () => {
            const token = localStorage.getItem('token')

            if(!token) {
                setLoading(false)
                return
            } 

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await costumerAxios('/profile', config)

                setAuth(data)

            } catch (error) {
                console.log(error)
            } 
            
            setLoading(false)
        
        }
        AuthUser()
    }, [])

    useEffect(() => {     
        const fetchUsers = async () => {
            const token = localStorage.getItem('token')

            if(!token) {
                setLoading(false)
                return
            } 

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await costumerAxios('/profiles', config)

                setAllUsers(data)

            } catch (error) {
                console.log(error)
            } 

            setLoading(false)
        
        };
        fetchUsers()
    }, [])

    const submitResposable = async (userID, dataAction) => {
        try {
            const token = localStorage.getItem('token')

            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const updatedUser = {
                responsable: true
              };
          
           await costumerAxios.put(`/${userID}`, updatedUser, config)

           await costumerAxios.post('/closeoftheday', dataAction, config)

        } catch (error) {
            console.log(error)
        }
    }

    const closeSessionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                allUsers,
                setAllUsers,
                submitResposable,
                closeSessionAuth
            }}
        >
            {children}
        </AuthContext.Provider>

    )
}

export {
    AuthProvider
}

export default AuthContext;