import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectRute from "./layouts/ProtectRute.jsx";
import ProtectRuteAdmission from "./layouts/ProtectRuteAdmission.jsx";

import Login from "./pages/Login.jsx";
import Booking from "./pages/Booking.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import NewPassword from "./pages/NewPassword.jsx";
import ConfirmAcc from "./pages/ConfirmAcc.jsx";
import Appointment from "./pages/Appointment.jsx";
import EditBooking from "./pages/editBookings.jsx";
import Bookings from "./pages/Bookings.jsx";
import CancelBooking from "./pages/CancelBooking.jsx";
import EditingBooking from "./pages/EditingBooking.jsx";
import Vista from "./pages/Vista.jsx";
import MenuAdmission from "./pages/MenuAdmission.jsx";
import RebookingMassively from "./pages/RebookingMassively.jsx";
import CreatePassword from "./pages/CreatePassword.jsx"; 
import ConfirmBooking from "./pages/ConfirmBooking.jsx";
import CustomPlans from "./pages/CustomPlans.jsx";
import CustomPlansSubscription from "./pages/CustomPlansSubscription.jsx";

import { AuthProvider } from './context/AuthProvider.jsx'
import { BookingProvider } from './context/BookingProvider.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<AuthLayout/>}>
                <Route index element={<Login/>}/>
                <Route path="Booking" element={<Booking/>} />
                <Route path="Register" element={<Register/>} />
                <Route path="ForgotPassword" element={<ForgotPassword/>} />
                <Route path="ForgotPassword/:token" element={<NewPassword/>} />
                <Route path="CreatePassword/:token" element={<CreatePassword/>} />
                <Route path="ConfirmAccount/:id" element={<ConfirmAcc/>} />
            </Route>

            <Route path="/Menu" element={<ProtectRute/>}>  
              <Route index element={<Bookings/>} />
              <Route path="Bookings" element={<Appointment/>} />
              <Route path="EditBooking" element={<EditBooking/>} />
              <Route path="EditBooking/:id" element={<EditingBooking/>} />
              <Route path="CancelBooking" element={<CancelBooking/>} />
            </Route>

            <Route path="/MenuAdmission" element={<ProtectRuteAdmission/>}>  
              <Route index element={<MenuAdmission/>} />
              <Route path="Today" element={<Vista/>} />
              <Route path="Register" element={<Register/>} />
              <Route path="Bookings" element={<Appointment/>} />
              <Route path="ReBooking" element={<EditBooking/>} />
              <Route path="ReBooking/:id" element={<EditingBooking/>} />
              <Route path="CloseSchedule" element={<RebookingMassively/>} />
              <Route path="ConfirmBooking/:id" element={<ConfirmBooking/>} />
              <Route path="CustomPlans" element={<CustomPlans/>} />
              <Route path="PlanSubscription" element={<CustomPlansSubscription/>} />
            </Route>
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
