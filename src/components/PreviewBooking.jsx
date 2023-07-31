import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { parseISO, format } from "date-fns";
import useBookings from "../hooks/useBookings";
import Alert from "./Alert";
import { useState } from "react";
import Modal from '../components/Modal';
import Modal8 from '../components/Modal8'

const PreviewBooking = ({booking}) => {

const { Motive, Type, subType, dateHour, _id } = booking
const [isButtonDisabled, setIsButtonDisabled] = useState(false);
const { deleteBooking } = useBookings();
const [alert, setAlert] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [isModalOpen1, setIsModalOpen1] = useState(false);
const { auth } = useAuth()
const navigate = useNavigate()

const parseDate = parseISO(dateHour);
const formattedDate = format(parseDate, 'dd/MM/yyyy');
const formattedHour = format(parseDate, 'HH:mm');

const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const handleClick = () => {

      setIsModalOpen1(true)
  
      deleteBooking(_id, {realizedBy: auth._id, Action: `Cita Cancelada por el usuario ${auth._id}`},
                    {Motive: Motive, Type: Type, subType: subType, dateHour: dateHour, Status: "Delete"}) 

        setAlert({
          msg: "Cita cancelada exitosamente",
          error: false
      });  

      setTimeout(() => {
        setAlert({})
        navigate('/Bookings')
        setIsModalOpen1(false)
      }, 3000)

      setIsButtonDisabled(true);
      setIsModalOpen(false);
    
}

const { msg } = alert

  return (

    <>
            <Modal className=" min-h-screen " isOpen={isModalOpen} onClose={closeModal} onDelete={handleClick} />
            <Modal8 className=" min-h-screen " isOpen={isModalOpen1} />


            {msg && <Alert alert={alert}/> }

    <div className="border-b p-12 gap-16 rounded-xl shadow-md shadow-gray-600 flex flex-col sm:flex-row justify-between">     
        <div className='text-left'>
            <p>Tipo de Paciente: <span className='font-semibold'> {Type} {Type === "Medicina Prepagada" ? subType : ""} </span></p>
             { subType && 
            <p>EPS: <span className='font-semibold'> {subType} </span></p>
             }
            <p>Motivo: <span className='font-semibold'> {Motive} </span> </p>
            <p>Fecha Seleccionada: <span className='font-semibold'> {formattedDate} </span> </p>
            <p>Hora Seleccionada: <span className='font-semibold'> {formattedHour} </span> </p>
        </div>

        <div className="flex justify-center sm:flex-col gap-4 items-center font-semibold">
        <div className="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
          <div className="flex">
            <span className="max-w-max">
              <Link className="" to={`/Bookings/editBooking/${_id}`}
              >Modificar</Link>
            </span>
          </div>
        </div>
      
        <div className="flex gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>


          <div className="flex">
            <span className="max-w-max">
              <button 
              onClick={openModal}
              disabled={isButtonDisabled}
              > Cancelar
              </button>
            </span>
          </div>
        </div>
        </div> 
    </div>
    </>
  )
}

export default PreviewBooking