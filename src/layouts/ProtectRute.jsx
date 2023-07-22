import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const ProtectRute = () => {

    const { auth, loading } = useAuth()
    const navigate = useNavigate()

    if (loading) {
        return 'Cargando...'
    }

    return (
        <>

        {auth.role === "User" ? 
        (

         <Outlet/>
                         
        ) : navigate('/') }

        </>
    )
}


export default ProtectRute