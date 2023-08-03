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
          <div className="flex justify-between gap-8">
            <div className="w-20">
            <svg
              id="Capa_2"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 246.82 220.08"
            >
              <defs>
                <style>{"\n      .cls-1 {\n        fill: #00a451;\n      }\n    "}</style>
              </defs>
              <g id="Capa_1-2" data-name="Capa 1">
                <path
                  className="cls-1"
                  d="m246.82,220.08c-17.81-.25-34.14-12.55-46.89-32.9-10.53-16.78-18.63-39.03-23.15-64.51-2.62-14.72-4.04-30.52-4.04-46.97-2.01,4.93-4.93,11.21-7.17,18.17l-21.54,65.95c-2.3,7.06-5.07,13.84-7.89,19.39-2.47,4.89-7.49,7.97-12.97,7.97-10.09,0-19.07-7.85-24.68-24.45l-1.78-5.24v-.02l-20.2-59.57c-2.69-7.85-6.28-17.04-8.52-22.43-4.04,21.99-6.73,83.67-6.73,111.71h-10.77c-6.67,0-12.12-2.51-15.5-7.19-2.43-3.34-3.79-7.79-3.79-13.22,0-32.07,9.71-100.39,15.06-133.25.03-.17.05-.32.07-.46C31.75,15.02,15.65,3.17,0,.3c28.41-2.75,56.11,13.41,78.17,40.9,5.66,7.05,10.95,14.85,15.79,23.27,13.79,23.99,23.89,52.99,28.37,84.04-.02.09-.03.18-.05.27h-.02s.01.03.01.04c0-.01,0-.03,0-.04l.09-.03c-.01-.08-.02-.16-.04-.24,1.12-5.69,2.66-10.32,4.2-15.39l17.73-54.51c6.69-20.86,14.86-35.19,21.02-42.15,1.66-1.88,4.06-2.94,6.57-2.94,17.05,0,28.26,10.77,30.73,31.86,0,27.86,2.13,53.98,5.85,76.55,7.63,46.16,21.93,77.43,38.39,78.15Z"
                />
              </g>
            </svg>
            </div>

            <div className="flex justify-center items-center">

            <Link to="/MenuAdmission">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill=" " className="w-9 h-9 fill-emerald-600 p-1.5 bg-gray-100 shadow-md shadow-gray-300 rounded ">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
            </Link>  
            </div>
          </div>

          <div className="flex gap-4">

          <p className="flex justify-center items-center text-lg whitespace-pre">¡Hola, <span className="font-bold text-base"> {auth.name} {auth.lastName}</span> 👋!</p>
          <div className=" flex justify-center items-center">
          <button onClick={handleCloseSession} type="button" className="shadow-md shadow-gray-300 max-h-12 text-white text-sm bg-emerald-700 p-3 rounded-md uppercase font-bold">
            Cerrar sesión
          </button>
          </div>

          </div>

        </div>

      </header>
  )
}

export default Header