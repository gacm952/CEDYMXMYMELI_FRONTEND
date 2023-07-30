import { Link } from "react-router-dom"
import { parseISO, format } from "date-fns";
import useBookings from "../hooks/useBookings";
import Alert from "./Alert";
import { useState, useMemo } from "react";
import useAuth from '../hooks/useAuth';
import Modal from "./Modal";
import Modal5 from '../components/Modal5';
import Modal6 from "./Modal6";

const PreviewBookingVista = ({booking}) => {

const { Motive, Type, subType, dateHour, _id, bookingFor, bookingTo, Status} = booking
const { allUsers, submitResposable, auth } = useAuth()
const memoizedAllUsers = useMemo(() => allUsers, [allUsers]);
const parseDate = parseISO(dateHour)
const formattedHour = format(parseDate, 'HH:mm');
const [alert, setAlert] = useState({})
const { deleteBooking, updateStatus } = useBookings();
const [isModalOpen, setIsModalOpen] = useState(false);
const [isModalOpen5, setIsModalOpen5] = useState(false);
const [isModalOpen6, setIsModalOpen6] = useState(false);

const bookingId = booking._id
const userIDtoCompare = bookingFor;
const userIDtoCompare2 = bookingTo;
const user = memoizedAllUsers.find((user) => user._id === userIDtoCompare);
const userTo = memoizedAllUsers.find((user) => user._id === userIDtoCompare2);
const userID = userTo ? `${userTo._id}` : user ? `${user._id}` : "Usuario Desconocido"
const userTypeofDocument = userTo ? `${userTo.typeDocument}` : user ? `${user.typeDocument}` : "Usuario Desconocido";
const userDocument = userTo ? `${userTo.document}` : user ? `${user.document}` : "Usuario Desconocido";
const userName = userTo ? `${userTo.name}` : user ? `${user.name}` : "Usuario Desconocido";
const userlastName = userTo ? `${userTo.lastName}` : user ? `${user.lastName}` : "Usuario Desconocido";
const isEPS = Type === "EPS"
const isActive = Status === "Active"
const target = bookingTo || bookingFor ;

const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const openModal5 = () => {
  setIsModalOpen5(true);
};

const closeModal5 = () => {
  setIsModalOpen5(false);
};


const openModal6 = () => {
  setIsModalOpen6(true);
};

const closeModal6 = () => {
  setIsModalOpen6(false);
};

const onDelete = () => {  
  deleteBooking(_id, {realizedBy: auth._id, Target: target, Action: "Cita Cancelada"},
                {bookingToEmail: userTo.email, bookingToName: userTo.name , bookingToLastName: userTo.lastName, dateHour: dateHour, Status: "Delete"}) 

  setTimeout(() => {
    setAlert({})
  }, 3000)

  setIsModalOpen(false);
}

const handleUpdateStatus = async (bookingId, passwordInput) => {
  try {
    if (passwordInput) {
      // Si se proporciona una contraseña, se puede enviar al backend para su validación
      await updateStatus(bookingId, passwordInput, {realizedBy: auth._id, Target: target, Action: "Estado actualizado a Active"});
    } else {
      // Si no se proporciona una contraseña, simplemente se actualiza el estado sin validación
      await updateStatus(bookingId, null, {realizedBy: auth._id, Target: target, Action: "Estado actualizado a Inactive"});
    }
  } catch (error) {
    console.log('Error al actualizar el estado:', error);
  }
}

const { msg } = alert

  return (

    <>
            {msg && <Alert alert={alert}/> }

            <div className="">  
                <div className='grid grid-cols-9 mb-1 rounded gap-10 p-2 border border-gray-500'>
                    <p className="grid items-center text-center">
                      {userTypeofDocument}</p>

                    <p className="grid items-center text-center ">
                      {userDocument}</p>

                    <p className="grid items-center text-center ">
                      {userName}</p>

                    <p className="grid items-center text-center ">
                      {userlastName}</p>
                  
                    <p className="grid items-center text-center whitespace-nowrap ">
                    {!isEPS && Type} {isEPS && 
                        subType
                        }  </p>
                 
                    <p className="grid items-center text-center whitespace-nowrap ">
                      {Motive}</p>
        
                    <p className="grid items-center text-center ">
                      {formattedHour}</p>

                      {isActive && (
                      <div className="flex justify-center">
                        <button 
                        className="px-7 gap-4 max-w-[100px]"
                        onClick={openModal5}
                        >
                          <div className="flex justify-center text-center group border rounded-lg border-gray-500 px-2 py-2 hover:border-green-700 hover:bg-green-700">
                            <svg
                              viewBox="0 0 512 512"
                              fill="green"
                              className="h-4 w-4 group-hover:fill-white"
                              >
                              <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z" />          
                            </svg>
                          </div>
                        </button>
                    </div>
                      )}
                  <Modal5 isOpen={isModalOpen5} onClose={closeModal5} onConfirm={handleUpdateStatus} bookingId={bookingId}/>
                        
                  {!isActive && (
                     <div className="flex justify-center">
                     <button 
                     className="px-7 gap-4 max-w-[100px]"
                     onClick={openModal6}
                     >
                       <div className="flex justify-center text-center group border rounded-lg border-gray-500 px-2 py-2 hover:border-red-700 hover:bg-red-700">
                       <svg
                         viewBox="0 0 320 512"
                         fill="red"
                         className="h-4 w-4 group-hover:fill-white"
                       >
                         <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256l105.3-105.4z" />
                       </svg>
                       </div>
                     </button>
                   </div>
                      )}

                    <Modal6  isOpen={isModalOpen6} onClose={closeModal6} onConfirm={handleUpdateStatus} bookingId={bookingId}/>
                    <div className="grid-cols-1 place-self-center font-semibold">
                
                        <div className="flex">
                          <span className="max-w-max">
                            <Link className=" flex gap-2 text-gray-600 hover:text-black" to={`/cedym_system/editBooking/${_id}`}
                            >Modificar
                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                            </Link>
                          </span>
                        </div>
                    
                        <div className="flex">
                          <span className="max-w-max">
                            <button 
                            onClick={openModal}
                            className="flex gap-2 text-gray-600 hover:text-black" 
                            > Cancelar
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                            <Modal isOpen={isModalOpen} onClose={closeModal} onDelete={onDelete} />
                          </span>
                        </div>

                    </div> 

                </div>
                  
               
            </div>
    </>
  )
}

export default PreviewBookingVista