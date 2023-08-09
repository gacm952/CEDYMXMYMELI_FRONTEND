import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import costumerAxios from "../config/costumerAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [allUsers, setAllUsers] = useState({})
    const [loading, setLoading] =useState(true)
    const navigate = useNavigate()
    const isAdmission = auth.role === "Admission"
    const isAdmin = auth.role === "Admin"
    const isUser = auth.role === "User"

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

    useEffect(() => {
        if (!loading && auth) {
          if (isAdmission || isAdmin) {
            navigate('/MenuAdmission'); 
          } else if (isUser) {
            navigate('/Menu'); 
          }
        }
      }, [loading, auth, isAdmission, isAdmin, isUser]);

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