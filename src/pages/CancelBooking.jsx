import useBookings from "../hooks/useBookings";
import PreviewBooking from "../components/PreviewBooking";
import useAuth from '../hooks/useAuth';

const CancelBooking = () => {

  const { bookings } = useBookings();
  const { auth } = useAuth();

  return (
    
    <div>
    <div className="container flex flex-col flex-wrap px-5 py-4 mx-auto">
        <div className="flex flex-col w-full text-center">
          <div className="py-6 bg-white sm:py-8 lg:py-12">
            <div className="px-4 mx-auto max-w-screen-2xl md:px-8">
            <h2>Hola {auth.name}, para borrar una cita dale al icono de la papelera </h2>
            <div className=" bg-gray-100 shadow mt-10 rounded-lg">
              {bookings.length ? 
                bookings.map((booking) => 
                  <PreviewBooking key={booking._id} booking={booking}/>
                )
              : <p>No Tienes Citas Aun </p> }
            </div>
            </div>
          </div>
        </div>
     </div>
  </div> 
  )
}

export default CancelBooking