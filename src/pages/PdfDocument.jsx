import { PDFViewer } from '@react-pdf/renderer';
import ActiveBookings from '../components/PDF/ActiveBookings'
import useAuth from '../hooks/useAuth';

const PdfDocument = ({bookings}) => {

  const { allUsers } = useAuth();

  const filteredBookings = bookings
  .sort((a, b) => a.dateHour.localeCompare(b.dateHour))
  .filter((booking) => booking.Status === "Active");

  const userData = filteredBookings.map(booking => {
    const user = allUsers.find(user => user._id === booking.bookingFor);
    const userTo = allUsers.find(user => user._id === booking.bookingTo);

    const userName = userTo ? userTo.name : user ? user.name : "Usuario Desconocido";
    const userlastName = userTo ? userTo.lastName : user ? user.lastName : "Usuario Desconocido";
    const userEmail = userTo ? userTo.email : user ? user.email : "Usuario Desconocido";

    return {
      userEmail,
      userName,
      userlastName,
      ...booking
    };
  });
    
  return (
    <>
    <PDFViewer className='w-full min-h-screen fixed inset-0 flex items-center justify-center z-10'>               
          <ActiveBookings bookings={userData} />
    </PDFViewer>     
    </>
  )
}

export default PdfDocument