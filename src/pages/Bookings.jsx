import { Link } from "react-router-dom"
import useBookings from "../hooks/useBookings";
import { useState, useEffect } from "react";
import Modal7 from "../components/Modal7";
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import Modal9 from "../components/Modal9";

const Bookings = () => {

  const { bookings } = useBookings()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen9, setIsModalOpen9] = useState(false);
  const [cancelationCount, setCancelationCount] = useState(0);
  const [cancelationsThisWeek, setCancelationsThisWeek] = useState(0);

  const isActive = bookings.some((booking) => booking.Status === "Active");

  const closeModal9 = () => {
    setIsModalOpen9(false);
    setCancelationsThisWeek(0);
    localStorage.setItem("isModalOpen9", false);
  };

  const countCancelations = (bookings) => {
    const cancelations = bookings.filter((booking) => booking.Status === "Delete");
    return cancelations.length;
  };
  
  useEffect(() => {
      const storedIsModalOpen9 = localStorage.getItem("isModalOpen9");
    if (storedIsModalOpen9 === "true") {
      setIsModalOpen9(true);
    }
  
    if (bookings.length > 0) {
      const totalCancelations = countCancelations(bookings);
      setCancelationCount(totalCancelations);
  
      const today = new Date();
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
      const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
  
      // Filtrar las cancelaciones para la semana actual
      const cancelationsThisWeek1 = bookings.filter((booking) => {
        const bookingDate = new Date(booking.dateHour);
        return (
          booking.Status === "Delete" &&
          isWithinInterval(bookingDate, { start: startOfWeekDate, end: endOfWeekDate })
        );
      }).length;
  
      setCancelationsThisWeek(cancelationsThisWeek1);
  
      if (cancelationsThisWeek >= 3) {
        const isModalOpenInLocalStorage = localStorage.getItem("isModalOpen9");
        if (isModalOpenInLocalStorage !== "false") {
          setIsModalOpen9(true);
        }
      }
    }
  }, [bookings]);

  useEffect(() => {
    const isModalOpenInLocalStorage = localStorage.getItem("isModalOpen9");
    if (isModalOpenInLocalStorage !== "false") {
      setIsModalOpen9(true);
      localStorage.setItem("isModalOpen9", "true"); // Actualizamos el valor en localStorage al montar el componente
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    openModal()
  }

  const makeBookingLink = (
    <Link
      to="Bookings"
      className="flex justify-center items-center gap-4 rounded-xl bg-gray-200 shadow-md shadow-gray-600 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-95  duration-300 p-12 text-center"
      onClick={handleClick}
    >
      Agendar Cita
      <svg
        className="w-8 h-8"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );

  const makeBookingLinkDisable = (
    <Link
      to="#"
      className="flex justify-center items-center gap-4 rounded-xl bg-gray-200 shadow-md shadow-gray-600 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-95  duration-300 p-12 text-center"
      onClick={handleClick}
    >
      Agendar Cita
      <svg
        className="w-8 h-8"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );


  return (
    <>

    <section className="flex h-screen justify-center relative flex-col">
      <div className=" grid grid-cols-1 gap-12 lg:grid-cols-2 mx-auto place-items-center font-bold text-center text-lg">   

      <Modal7 isOpen={isModalOpen} onClose={closeModal} />
      <Modal9 isOpen={isModalOpen9} onClose={closeModal9} />

        {isActive ? (
          <>
            {makeBookingLinkDisable}
          </>
        ) : (
          <>{makeBookingLink}</>
        )}
        
   
        <Link to="EditBooking" className="flex justify-center items-center gap-4 rounded-xl bg-gray-200 shadow-md shadow-gray-600 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-95  duration-300 p-12 text-center">
          ReAgendar Cita
            <svg className="w-8 h-8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
    
    </>
  )
}

export default Bookings