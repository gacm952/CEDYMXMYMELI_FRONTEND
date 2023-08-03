import useBookings from "../hooks/useBookings";
import PreviewBooking from "../components/PreviewBooking";
import { Link } from "react-router-dom";

const editBooking = () => {

const { bookings } = useBookings();

const isDateActive = bookings.some(booking => booking.Status === "Active")

    return (
      <>

      <div>
        <div className="justify-center place-items-center h-screen items-center align-middle flex flex-col flex-wrap">
            <div className="text-center">
              <div>

              <div className="flex ml-2">
                <Link to="/Menu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                  </svg>
                </Link>
              </div>
              
                <div className="px-4 md:px-8">
                  <header className="my-8">
                    <h2 className=" mb-4 text-2xl font-bold text-center text-gray-800 lg:text-2xl md:mb-6" >
                    {isDateActive ? 
                      <p> Tienes Una Cita Pronto <br/> ¡Te Esperamos!</p>   
                    : <p> No Tienes Aún Citas Agendadas.</p>}
                    </h2>
                  </header>
                  <div className="min-w-[300px] bg-gray-100 shadow mt-10 rounded-lg">
                    {isDateActive ? 
                      bookings
                      .filter(booking => booking.Status === "Active")
                      .map((booking) => 
                        <PreviewBooking key={booking._id} booking={booking}/>
                      ).slice(0, 1)
                    : <p className="p-8 bg-gray-100 shadow mt-10 rounded-lg">No tienes aún ninguna cita </p> }
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>  
      
      </>
    )
  };
  
  export default editBooking