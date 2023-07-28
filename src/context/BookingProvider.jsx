import {useState, useEffect, createContext} from 'react'
import costumerAxios from '../config/costumerAxios';
import { useNavigate } from 'react-router-dom';
import { parseISO } from 'date-fns';
import useAuth from '../hooks/useAuth';

const BookingContext = createContext();

const BookingProvider = ({children}) => {   

    const [bookings, setBookings] = useState([])
    const [alert, setAlert] = useState({})
    const [allBookings, setAllBookings] = useState({})
    const [dateFromBackend, setDateFromBackend] = useState(null);
    const navigate = useNavigate();
    const {auth} = useAuth();
    const isAdmission = auth.role === "Admission";
    const isUser = auth.role === "User";

    useEffect(() => {
        const getBookings = async () => {
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

            const { data } = await costumerAxios('/createbooking', config)
            
            setBookings((prevBookings) => [...prevBookings, ...data])

            } catch (error) {
                
            }
        }
        getBookings()
    }, [auth])

    useEffect(() => {
        const getDateBookings = async () => {
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

            const { data } = await costumerAxios('/allbookings', config)

            setAllBookings(data);

            const parsedDates = data.map((booking) => parseISO(booking.dateHour));
            
            setDateFromBackend(parsedDates);
            
            } catch (error) {
                
            }
        }
        getDateBookings()
    }, [auth])

    const submitBooking = async (booking, dataAction) => {

        if (booking.id) {
            await editBooking(booking, dataAction)
        } else {
            await newBooking(booking, dataAction)
        }

    }

    const editBooking = async (booking, dataAction) => {
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

            const { data } = await costumerAxios.put(`/${booking.id}/actualizar`, booking, config)
          
            await costumerAxios.post('/editbookingact', dataAction, config)

                setBookings((prevBookings) => {
                  return prevBookings.map((prevBooking) => {
                    if (prevBooking.id === data.id) {
                      return data;
                    }
                    return prevBooking;
                  });
                });
              
            setTimeout(() => {
                if (isAdmission) {
                    navigate("/cedym_system/vista-admission")
                } 

                if (isUser) {
                    navigate("/Bookings")
                }
            }, 3000 )

        } catch (error) {
            console.log(error)
        }
    }

    const newBooking = async (booking, dataAction) => {

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

            const { data } = await costumerAxios.post('/createbooking', booking, config)

            await costumerAxios.post('/bookingcreated', dataAction, config)
                            
            setTimeout( () => {
                setBookings((prevBookings) => [...prevBookings, data])

                if (isAdmission) {
                    navigate("/cedym_system")
                } 
    
                if (isUser) {
                    navigate("/Bookings")
                }
            }, 5000 )             

        
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBooking = async (id, dataAction, updatedBookingStatus) => {
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

            const { data } = await costumerAxios.put(`/${id}/delete`, updatedBookingStatus, config)
            
            await costumerAxios.post('/cancelbookingact', dataAction, config)

            setAllBookings((prevAllBookings) => {
                return prevAllBookings.map((prevBooking) => {
                    if (prevBooking._id === data._id) {
                        return data;
                    }
                    return prevBooking;
                });
            });

        } catch (error) {
            console.log(error)
        }
    }

    const updateStatus = async (bookingId, passwordInput, dataAction) => {
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

            const { data: { Status } } = await costumerAxios.get(`/${bookingId}`, config)

            const updatedUserStatus = {
              Status: Status === 'Active' ? 'Inactive' : 'Active',
              password: passwordInput
            }

            const { data } = await costumerAxios.put(`/${bookingId}/status`, updatedUserStatus, config)
            
            await costumerAxios.post('/statuschanged', dataAction, config)

            // Actualizar el estado de allBookings con la respuesta de la solicitud
            setAllBookings((prevAllBookings) => {
                return prevAllBookings.map((prevBooking) => {
                    if (prevBooking._id === data._id) {
                        return data;
                    }
                    return prevBooking;
                });
            });

        } catch (error) {
            console.log(error)
        }
    }   

    const massiveReBooking = async (ids, newDateHours, dataAction) => {
        try {
          const token = localStorage.getItem('token');
      
          if (!token) {
            return;
          }
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          };
      
          const { data } = await costumerAxios.put('/desplazamiento', { ids, newDateHours }, config);

          setAllBookings(data)

          await costumerAxios.post('/massiverebookingact', dataAction, config)
      
        } catch (error) {
          console.log(error);
        }
      };

    const closeSessionBooking = () => {
        setBookings([])
        setBookings({})
        setAlert({})
        allBookings({})
        dateFromBackend({})
    }

  return (
    <>
    <BookingContext.Provider
        value={{
            alert,
            bookings,
            submitBooking,
            dateFromBackend,
            newBooking,
            deleteBooking,
            allBookings,
            updateStatus,
            closeSessionBooking,
            massiveReBooking
    }}
    > {children}
    </BookingContext.Provider>
    
    </>
  )
}

export {
    BookingProvider
}

export default BookingContext