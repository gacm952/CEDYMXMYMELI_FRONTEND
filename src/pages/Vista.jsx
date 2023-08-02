import { useState, useEffect, useContext, useMemo  } from 'react'
import { Link } from "react-router-dom";
import PreviewBookingVista from "../components/PreviewBookingVista";
import useAuth from '../hooks/useAuth';
import BookingContext from '../context/BookingProvider';
import CalendarVista from "../components/CalendarVista";
import { format } from 'date-fns';
import Modal2 from '../components/Modal2';
import PdfDocument from './PdfDocument';
import { isToday } from 'date-fns';

const Vista = () => {

const { allBookings } = useContext(BookingContext);
const { allUsers, loading, submitResposable, auth } = useAuth()
const [selectedDate, setSelectedDate] = useState(new Date());
const [searchTerm, setSearchTerm] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [showPdf, setShowPdf] = useState(false);
const [alert, setAlert] = useState({});
const [isButtonEnabled, setIsButtonEnabled] = useState(false);
const [isDayClosed, setIsDayClosed] = useState(false);
const isTodayTrue = isToday(selectedDate);

const currentTime = new Date();
const closingTime = new Date(currentTime);
closingTime.setHours(18, 0, 0);

useEffect(() => {
  const enableButton = currentTime >= closingTime;
  setIsButtonEnabled(enableButton);

  if (enableButton) {
    const timeoutId = setTimeout(() => {
      setIsButtonEnabled(false);
    }, 3600000);

    // Limpiar el temporizador al desmontar el componente
    return () => clearTimeout(timeoutId);
  }
}, [currentTime]);

const formattedSelectedDate = selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : '';
const dateAction = selectedDate ? format(new Date(selectedDate), 'dd-MM-yyyy') : '';

const handleDateChange = (newValue) => {
  setSelectedDate(newValue);

  localStorage.setItem('selectedDate', JSON.stringify(newValue));
};

useEffect(() => {
  const storedDate = localStorage.getItem('selectedDate');

  if (storedDate) {
    setSelectedDate(new Date(JSON.parse(storedDate)));
  }
}, []);

const handleSearch = (event) => {
  if (event.key === 'Enter') {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  }
};

const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const handleUpdateResponsable = async (e) => {

  e.preventDefault();

  try {
    for (const booking of filteredBookings) {
      if (booking.Status === "Active") {
        const userID = booking.bookingFor;
        await submitResposable(userID, {realizedBy: auth._id, Target: userID, Action: `Dia de cierre completado del ${dateAction}`});
        console.log("Responsable actualizado exitosamente para el usuario con ID:", userID);
      }
    }

    closeModal();

    setAlert({
      msg: "Cierre del dia completado",
      error: false
    })    

    setTimeout(() => {
      // Avanzar al siguiente día
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);

      // Marcar el día actual como cerrado
      setIsDayClosed(true);

      // Reiniciar alarma
      setAlert({})
    }, 3000);
    
  } catch (error) {
    console.log(error);
  }
};

const handlePrint = () => {
  if (isTodayTrue) {
    setShowPdf(true);
  } else {
    setShowPdf(false);
  }
};

const filteredBookings = useMemo(() => {
  if (loading || !Array.isArray(allBookings) || !Array.isArray(allUsers)) {
    return [];
  }

  return allBookings.filter((booking) => {
    const bookingDate = booking.dateHour.slice(0, 10);
    const bookingType = booking.Type.toLowerCase();
    const bookingMotive = booking.Motive.toLowerCase();
    const bookingUser = allUsers.find(user => user._id === booking.bookingFor);
    const userName = bookingUser ? bookingUser.name.toLowerCase() : '';
    const userLastName = bookingUser ? bookingUser.lastName.toLowerCase() : '';

    return (
      (!selectedDate || bookingDate === formattedSelectedDate) &&
      (searchTerm === '' || bookingMotive.includes(searchTerm.toLowerCase()) 
      || bookingType.includes(searchTerm.toLowerCase()) 
      || userName.includes(searchTerm.toLowerCase())
      || userLastName.includes(searchTerm.toLowerCase()))
    );
  });
}, [loading, allBookings, allUsers, selectedDate, formattedSelectedDate, searchTerm]);

    return (
      <>  
      <div className="min-w-7xl min-h-screen mx-8 text-xl sm:text-sm">

          <div className="hidden justify-between pt-4 px-4">
                  <Link to="/MenuAdmission">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                  </Link>

                  <Link to="/MenuAdmission">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </Link>   
          </div>
          
          <header className="my-12 flex justify-between">

            <div className="flex items-center">

              <h2 className="text-2xl font-bold text-center text-gray-800 lg:text-2xl">
                Citas de Hoy
              </h2>   

              <div className="ml-4">
              <CalendarVista
               value={selectedDate}
               onChange={handleDateChange}
               isDayClosed={isDayClosed}/>
              </div>

            </div>

            <div className="flex">


              <div className='grid items-center'>
                <button 
                disabled={!isButtonEnabled}
                onClick={openModal}
                className='
                      px-6
                      py-3
                      mr-8
                    text-white
                    bg-red-700
                      rounded-md 
                      outline-none
                    hover:bg-red-800
                      text-sm                      
                      font-bold
                      uppercase 
                    '>
                  Cierre del día 
                </button>
                <Modal2 isOpen={isModalOpen} onClose={closeModal} handleUpdateResponsable={handleUpdateResponsable} />
              </div>           

                <label 
                className="flex items-center " 
                htmlFor="search">  
                <input               
                placeholder="Buscar... "
                className="px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-blue-700 focus:border-blue-700 " 
                type="search" 
                onKeyUp={handleSearch}
                />
                </label>       

                <svg className="w-6 h-6 mt-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>  

                 <Link className='ml-2 mt-4' onClick={handlePrint}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                </Link>  

                {showPdf && isTodayTrue && (
                  <PdfDocument bookings={filteredBookings} />
                )}
  
            </div>
        
          </header>

            <div>

              <div className=''>

            <div className='grid grid-cols-9 gap-10 mb-4 text-center font-semibold text-base'>
              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b ">Documento</p>
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b"># Documento</p>
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Nombres</p> 
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Apellidos</p> 
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Tipo</p> 
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Motivo</p> 
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Hora</p> 
              </div>

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Asistió</p> 
              </div> 

              <div>
                <p className="min-w-[100px] mb-2 pb-1 border-b">Acciones</p> 
              </div> 
             
            </div>

             

              </div>

            <div>
                    {filteredBookings.length ? (
            <div className=''>
              {filteredBookings
                .sort((a, b) => a.dateHour.localeCompare(b.dateHour))
                .filter((booking) => booking.Status === "Active")
                .map((booking) => (
                <PreviewBookingVista key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <p>No hay citas aún</p>
          )}
            </div>
            </div>

            <div className="mt-32">
              <h2 className="text-2xl font-bold text-left text-gray-800 lg:text-2xl mb-8">
                  Pacientes que Asistieron
              </h2> 
                        {filteredBookings.length ? (
                <div className=''>
                  {filteredBookings
                    .sort((a, b) => a.dateHour.localeCompare(b.dateHour))
                    .filter((booking) => booking.Status === "Inactive")
                    .map((booking) => (
                    <PreviewBookingVista key={booking._id} booking={booking} />
                  ))}
                </div>
              ) : (
                <p>No hay citas aún</p>
              )}
            </div>
    
      </div>
      </>
    )
  };
  
  export default Vista