import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import useBookings from "../hooks/useBookings"; 
import CalendarRange from "../components/CalendarRange"
import CalendarRange2 from "../components/CalendarRange2"
import useAuth from "../hooks/useAuth";
import format from "date-fns/format";


const RebookingMassively = () => {

  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [timeRangeStart, setTimeRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);
  const [timeRangeEnd, setTimeRangeEnd] = useState(null);
  const [alert, setAlert] = useState({})

  const { allBookings, massiveReBooking } = useBookings();
  const { auth, allUsers } = useAuth()
  const navigate = useNavigate();

  const handleDateRangeStartChange = (selectedRange) => {
    setDateRangeStart(selectedRange);
  };

  const handleTimeRangeStartChange = (selectedTime) => {
    setTimeRangeStart(selectedTime);
  };

  const handleDateRangeEndChange = (selectedRange) => {
    setDateRangeEnd(selectedRange);
  };

  const handleTimeRangeEndChange = (selectedTime) => {
    setTimeRangeEnd(selectedTime);
  };
 
  const handleRebooking = () => {
    const availableBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.dateHour);
  
      if (dateRangeStart.toDateString() === dateRangeEnd.toDateString()) {
        // Si se selecciona el mismo día, incluye las citas dentro del rango de horas
        if (timeRangeStart && timeRangeEnd) {
          const startTime = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate(), timeRangeStart.getHours(), timeRangeStart.getMinutes());
          const endTime = new Date(dateRangeEnd.getFullYear(), dateRangeEnd.getMonth(), dateRangeEnd.getDate(), timeRangeEnd.getHours(), timeRangeEnd.getMinutes());
          return bookingDate >= startTime && bookingDate <= endTime;
        } else {
          // Si no se seleccionan horas, incluye todas las citas del día seleccionado
          const selectedDate = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate());
          return bookingDate >= selectedDate && bookingDate < new Date(selectedDate.getTime() + 86400000);
        }
      } else {
        // Si hay un rango de fechas, realiza la comparación normal
        const startDate = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate());
        const endDate = new Date(dateRangeEnd.getFullYear(), dateRangeEnd.getMonth(), dateRangeEnd.getDate(), 23, 59, 59, 999);
        return bookingDate >= startDate && bookingDate <= endDate;
      }
    });
  
    const daysDifference = Math.ceil((dateRangeEnd - dateRangeStart) / (1000 * 60 * 60 * 24));
    const totalBookings = availableBookings.length;
    const averageBookingsPerDay = Math.floor(totalBookings / daysDifference);  
    const bookingsPerDay = Array(daysDifference).fill(averageBookingsPerDay);
    const remainder = totalBookings - (averageBookingsPerDay * daysDifference);
  
    for (let i = 0; i < remainder; i++) {
      bookingsPerDay[i] += 1;
    }
    
    let currentIndex = 0; // Índice inicial en availableBookings
    const nextDay = new Date(dateRangeEnd);
    nextDay.setDate(nextDay.getDate() + 1); // Obtener el día siguiente a dateRangeEnd
    let currentDay = new Date(nextDay); // Fecha inicial para asignar el nuevo dateHour
    const newDateHours = []; // Array para almacenar los nuevos dateHour
  
    for (const bookingsCount of bookingsPerDay) {
      for (let i = 0; i < bookingsCount; i++) {
        const booking = availableBookings[currentIndex];
        const bookingDate = new Date(booking.dateHour);
  
        // Asignar el nuevo dateHour al día actual si es posterior a la hora seleccionada
        const newDateHour = new Date(currentDay);
  
        if (timeRangeStart && timeRangeEnd) {
          const startTime = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate(), timeRangeStart.getHours(), timeRangeStart.getMinutes());
  
          if (bookingDate >= startTime) {
            newDateHour.setHours(timeRangeEnd.getHours());
            newDateHour.setMinutes(timeRangeEnd.getMinutes());
            newDateHours.push(newDateHour); // Agregar el nuevo dateHour al array
          }
        } else {
          newDateHour.setHours(bookingDate.getHours());
          newDateHour.setMinutes(bookingDate.getMinutes());
          newDateHours.push(newDateHour); // Agregar el nuevo dateHour al array
        }
  
        currentIndex++; // Avanzar al siguiente día en availableBookings
      }
  
      currentDay.setDate(currentDay.getDate() + 1); // Avanzar al siguiente día
    }

  const selectedBookings = availableBookings.slice(0, totalBookings); // Obtén las citas seleccionadas para reprogramar
  const ids = selectedBookings.map(booking => booking._id); // Array de IDs de las citas seleccionadas

  const userDataFromBooking = selectedBookings.map(booking => booking.bookingTo || booking.bookingFor);
  const usersId = allUsers.map(user => user._id)
  const startTime = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate(), timeRangeStart.getHours(), timeRangeStart.getMinutes());
  const endTime = new Date(timeRangeEnd.getFullYear(), timeRangeEnd.getMonth(), timeRangeEnd.getDate(), timeRangeEnd.getHours(), timeRangeEnd.getMinutes());

  // Utilizamos el método filter para obtener los IDs que coinciden en ambos arrays
  // const matchingIds = usersId.filter(id => userDataFromBooking.includes(id));

  const formattedDateStart = format(dateRangeStart, 'd MMMM yyyy');
  const formattedDateEnd = format(dateRangeEnd, 'd MMMM yyyy');
  const formattedHourStart = format(startTime, 'HH:mm');
  const formattedHourEnd = format(endTime, 'HH:mm');

  massiveReBooking(ids, newDateHours, {realizedBy: auth._id, Action: `Se cerró la agenda desde ${formattedDateStart} ${formattedHourStart || ''} hasta el ${formattedDateEnd} ${formattedHourEnd || ''} para las siguientes citas: ${ids}`}); // Llama a massiveReBooking pasando el array de IDs
  
  setAlert({
    msg: "Citas reprogramadas exitosamente",
    error: false
  })

  setTimeout(() => {
    navigate("/cedym_system/vista-admission");
    setAlert({})
  }, 5000);

  };

  const { msg } = alert

  return (
    <>
    <div className="flex justify-center items-center flex-col min-h-screen">
        <div className="mb-14">
            <header className="mb-12">
                <h2 className="text-center mb-4 text-2xl font-bold text-gray-800 lg:text-3xl md:mb-6">
                    Re-agendar citas
                </h2>
                <p className="max-w-screen-md mx-auto text-center text-gray-500 md:text-lg">
                    Para reprogramar multiples citas a la fecha más cercana disponible <br/> seleccione las fechas en las que no habrán disponibilidad.
                </p>
            </header>

                {msg && <Alert alert={alert}/>}

                <div className="mb-12">
                    <p className="mb-2"> Desde el: {dateRangeStart ? dateRangeStart.toLocaleDateString() : ""} {timeRangeStart ? <span>desde las</span> : "" } {timeRangeStart ? timeRangeStart.toLocaleTimeString() : ""}</p>  
                    <CalendarRange onDateChange={handleDateRangeStartChange} onTimeChange={handleTimeRangeStartChange}/>
                </div>

                <div>
                    <p className="mb-2"> Hasta el: {dateRangeEnd ? dateRangeEnd.toLocaleDateString() : ""} {timeRangeEnd ? <span>hasta las</span> : "" } {timeRangeEnd ? timeRangeEnd.toLocaleTimeString() : ""}</p>
                    <CalendarRange2 onDateChange={handleDateRangeEndChange} onTimeChange={handleTimeRangeEndChange}/>
                </div>
        </div> 
        <button className='
                        flex    
                        justify-center
                      px-6
                      py-3
                    text-white
                    bg-emerald-700
                      rounded-md 
                      outline-none
                    hover:bg-emerald-800
                      text-sm                      
                      font-bold
                      uppercase 
                    '
                onClick={handleRebooking}
                    >
                 Re-agendar
                </button>   
    </div>
    
    </>
  )
}

export default RebookingMassively