import Stepper from "../components/Stepper";
import useBookings from "../hooks/useBookings";
import Alert from "../components/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const Appointment = () => {

const { auth } = useAuth();
const { bookings } = useBookings();
const [alert, setAlert] = useState({});
const navigate = useNavigate();

const isActive = bookings.some((booking) => booking.Status === "Active");
const isUser = [auth].some((role) => role.role === "User");

useEffect(() => {

    if (isActive && isUser) {
      setAlert({
        msg: "Ya tienes una cita reservada, si deseas editar tu cita, selecciona la opción de Editar Cita",
        error: true
      });

      setTimeout(() => {
        navigate("/Menu")
      }, 4000);
    }

}, [bookings]);

const { msg } = alert

    return (
        <> 
      <div className="text-gray-600 min-h-screen w-full flex justify-center items-center">
        <div className="container flex flex-col flex-wrap px-5 py-4 mx-auto">
            <div className="flex flex-col w-full text-center">
              <div className="py-6 bg-white sm:py-8 lg:py-12">

                {msg && <Alert alert={alert} />}

                {(!isUser || !isActive) && (
                  <div className="px-4 mx-auto max-w-screen-2xl md:px-8">
                    <Stepper />
                  </div>
                )}         
              </div>
            </div>
        </div>
      </div>                     
        </>
    )
}


export default Appointment