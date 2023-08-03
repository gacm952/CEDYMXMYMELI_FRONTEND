import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useBookings from "../hooks/useBookings"
import { Navigate } from "react-router-dom"

const Header = () => {

  const {closeSessionAuth, auth} = useAuth()
  const {closeSessionBooking} = useBookings()
  const navigate = useNavigate()

  const handleCloseSession = () => {
    //closeSessionAuth()
    //closeSessionBooking()
    localStorage.removeItem('token')
    setTimeout(() => {
      navigate("/")
    }, 2000);
  }

  return (
      <header className="px-4 py-5 bg-gray-50 border-b w-full">
        <div className="flex justify-between mx-4 ">
          <div className="flex justify-between gap-4">
            <h2 className="text-4xl text-emerald-700 font-black text-center">
              CEDYM
            </h2>

            <Link to="/MenuAdmission">
                <svg className="w-8 h-8 mt-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </Link>  
          </div>

          <div className="flex gap-4">

          <p className="flex justify-center items-center text-lg font-semibold">¡Hola, {auth.name} 👋!</p>
          
          <button onClick={handleCloseSession} type="button" className="text-white text-sm bg-emerald-700 p-3 rounded-md uppercase font-bold">
            Cerrar sesión
          </button>

          </div>

        </div>

      </header>
  )
}

export default Header