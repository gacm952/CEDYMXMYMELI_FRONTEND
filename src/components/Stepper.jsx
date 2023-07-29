import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Calendar from "../components/Calendar"
import useAuth from '../hooks/useAuth';
import useBookings from '../hooks/useBookings';
import Alert from '../components/Alert';
import Alert2 from '../components/Alert2'
import { useNavigate } from 'react-router-dom';
import Modal3 from './Modal3';
import Modal4 from './Modal4';
import { parseISO, format } from 'date-fns';

const Stepper = () => {

  const [step, setStep] = useState(1); // Estado para rastrear el paso actual
  const [userData, setUserData] = useState({}); // Estado para almacenar los datos del formulario de información del usuario
  const [id, setId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Cambia a null en lugar de cadena vacía
  const [selectedTime, setSelectedTime] = useState(null); // Cambia a null en lugar de cadena vacía 
  const [selectedOption, setSelectedOption] = useState(userData.Type || "");
  const [showSecondSelect, setShowSecondSelect] = useState(false);
  const [secondSelectValue, setSecondSelectValue] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [alert, setAlert] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState(null);
  const [alert2, setAlert2] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [showCitaValorativa, setShowCitaValorativa] = useState(false);
  const [isVisitadorMedico, setIsVisitadorMedico] = useState(false);
  const [userFoundNames, setUserFoundNames] = useState(''); 
  const [typeDocument, setTypeDocument] = useState('');
  const [foundUserName, setFoundUserName] = useState('');
  const [foundUserLastName, setFoundUserLastName] = useState('');
  const [foundUserEmail, setFoundUserEmail] = useState('');

  const navigate = useNavigate();
  const params = useParams()
  const { allBookings, submitBooking, bookings } = useBookings();
  const { auth, allUsers } = useAuth();
  const roleUser = [auth].some((role) => role.role === "User")
  const isResponsable = [auth].some((role) => role.responsable === true)
  const bookingData = allBookings.find(booking => booking._id === params.id) 
  const bookingAuth = allBookings.filter(booking => booking.bookingTo === auth._id)

  useEffect(() => {
    if (params.id) {
      setId(params.id);

      if (bookingData) {
        setUserData((prevData) => ({
          ...prevData,
          Type: bookingData.Type || "",
          subType: bookingData.subType || "",
          Motive: bookingData.Motive || "",
        }));
        if (bookingData.dateHour) {
          const dateHour = parseISO(bookingData.dateHour);
          setSelectedDate(dateHour);
          setSelectedTime(dateHour);
        }
      }
    }
  }, [params.id, bookingData]);

  useEffect(() => {
    if (isResponsable) {
      setIsModalOpen1(true);
    }
  }, [isResponsable]);

  useEffect(() => {
  }, [foundUserId]);

  useEffect(() => {
    if (userData.Type === "Particular") {
      setShowCitaValorativa(true);
    } else {
      setShowCitaValorativa(false);
    }
    if (userData.Type === "Visitador Médico") {
      setIsVisitadorMedico(true);
    } else {
      setIsVisitadorMedico(false);
    }
  }, [userData.Type]);

  const handleNextStep = () => {
    
    // Validar campos antes de pasar al siguiente paso

    if (step === 1 && (!userData.Type || !userData.Motive || (userData.Type === "EPS" && !userData.subType))) {
      setAlert({
        msg: 'Completa todos los campos obligatorios antes de continuar.',
        error: true
      });
      return
    }

    if (step === 2 && (!selectedDate || !selectedTime)) {
      setAlert({
        msg: 'Completa todos los campos obligatorios antes de continuar.',
        error: true
      });
      return
    }

    // Pasar al siguiente paso

    setStep(step + 1);

    // Reiniciar la Alerta

    setAlert({});

  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value}));

    const { Type, subType, Motive } = userData;
    if (Type && Motive && (!Type === "EPS" || subType)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleFirstSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    setUserData((prevData) => ({ ...prevData, Type: selectedValue }));

    if (selectedValue === "EPS") {
        setShowSecondSelect(true);
    } else {
        setShowSecondSelect(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen1(false);
  };

  const stepText = {
    1: "Completa el Siguiente Formulario.",
    2: "Selecciona una Fecha Disponible.",
    3: "Verifica tus Datos."
  };

  const {Type, subType, Motive} = userData
  const dateHour = `${selectedDate}, ${selectedTime}`
  const citaData = {
    dateHour,
    Type,
    subType,
    Motive
  };

  const handleConfirmCita = (e) => {

    e.preventDefault();

    // Crea el objeto `Date` combinando la fecha y la hora

    const dateHour = new Date(selectedDate);
    dateHour.setHours(selectedTime.getHours());
    dateHour.setMinutes(selectedTime.getMinutes());

    const haveMotiveNutri = bookingAuth.some(booking => booking.Motive === "Nutricion Primera vez");
    const haveMotiveMI = bookingAuth.some(booking => booking.Motive === "Medicina Interna Primera vez");
    const haveMotiveMIG = bookingAuth.some(booking => booking.Motive === "Medicina Integral Primera vez");
    const haveMotivePG = bookingAuth.some(booking => booking.Motive === "Psicologia Primera vez");
    const haveMotiveCV = bookingAuth.some(booking => booking.Motive === "Cita Valorativa Primera vez");
    const haveMotiveMG = bookingAuth.some(booking => booking.Motive === "Medicina General Primera vez");
    const haveMotiveG = bookingAuth.some(booking => booking.Motive === "Ginecologia Primera vez");

    const formattedDateHour = format(dateHour, 'dd/MM/yyyy HH:mm:ss');
    
    // Determinar el valor adecuado para la propiedad Motive
    let updatedMotive;

    if (haveMotiveNutri && Motive === "Nutricion Primera vez") {
      updatedMotive = "Nutricion Control";
    } else if (haveMotiveMI && Motive === "Medicina Interna Primera vez") {
      updatedMotive = "Medicina Interna Control";
    } else if (haveMotiveMIG && Motive === "Medicina Integral Primera vez") {
      updatedMotive = "Medicina Integral Control";
    } else if (haveMotivePG && Motive === "Psicologia Primera vez") {
      updatedMotive = "Psicologia Control";
    } else if (haveMotiveCV && Motive === "Cita Valorativa Primera vez") {
      updatedMotive = "Cita Valorativa Control";
    } else if (haveMotiveMG && Motive === "Medicina General Primera vez") {
      updatedMotive = "Medicina General Control";
    } else if (haveMotiveG && Motive === "Ginecologia Primera vez") {
      updatedMotive = "Ginecologia Control";
    } else {     
        // Si no tiene ninguna cita en ninguna especialidad, entonces mostrar "Nuevo Paciente" para la especialidad actual
        updatedMotive = `${Motive}`;   
    }

    const target = bookingData?.bookingTo || bookingData?.bookingFor || auth._id

    // Pasar los datos hacia el provider

    submitBooking({id, dateHour, Type, subType, Motive: updatedMotive, bookingTo: foundUserId, bookingToName: foundUserName || auth.name, bookingToLastName: foundUserLastName || auth.lastName, bookingToEmail: foundUserEmail || auth.email }, 
                  {realizedBy: auth._id, Target: target, Action: `${Motive} para el ${formattedDateHour}` });
    
    setAlert({
      msg: 'Cita agendada correctamente, ¡te esperamos!',
      error: false,
    });

    setIsButtonDisabled(true);

    };
     
  const handleSearch = (e) => {

    e.preventDefault();

    const found = allUsers.find(user => user.document === parseInt(searchEmail));

    const documentTypeVerification = allUsers.some((user) => user.typeDocument === typeDocument)

    const userFoundNames =  `Nombre: ${found.name} ${found.secondName} ${found.lastName} ${found.secondLastName} ${found.typeDocument}: ${found.document}`
    
      if (found && documentTypeVerification) {
        
        setFoundUserId(found._id);
        setFoundUserName(found.name)
        setFoundUserLastName(found.lastName)
        setFoundUserEmail(found.email)
        setSearchEmail(userFoundNames);

        setAlert2({
          msg: `Paciente encontrado`,
          error: false,
        });

        setTimeout(() => {
          setAlert2({});
        }, 5000);

        if (found.responsable) {
          openModal()
        }

      } else {

        setFoundUserId(null);

        setAlert2({
          msg: 'Cédula No Encontrada',
          error: true,
        });

        setTimeout(() => {
          setAlert2({});
        }, 2000);
      }
    };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <form className='max-w-screen-md mx-auto'>

              {(!roleUser && !params.id) && (  <div className='flex flex-col my-4'>
                    <div className='flex gap-2'>
                      <div className='flex-[1%] mt-8'>
                                      <select
                                        id="emailV"
                                        className="text-center font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={typeDocument}
                                        onChange={e => setTypeDocument(e.target.value)}
          
                                      >🡣
                                        <option value="" hidden >🡣</option>
                                        <option value="CC">CC</option>
                                        <option value="TI">TI</option>
                                        <option value="RUT">RUT</option>
                                        <option value="CE">CE</option>
                                        <option value="RCN">RCN</option>
                                        <option value="NIT">NIT</option>
                                        <option value="PEP">PEP</option>
                                        <option value="PPT">PPT</option>
                                        <option value="P">P</option>
                                        <option value="LM">LM</option>
                                        <option value="ESI">EX</option>

                                      </select>
                      </div>

                      <div className='flex-[80%] flex-col'>
                
                        <label
                            className="inline-flex mb-2 text-sm text-gray-800"
                            htmlFor='' 
                          >Ingresa el Documento del Paciente </label>
                      
                        <input 
                        type="search"   
                        placeholder='Buscar Documento'
                        className='w-full
                                px-3
                                py-2
                                text-gray-800
                                border
                                rounded
                                outline-none
                                bg-gray-50
                                focus:ring
                                ring-emerald-500
                                mb-4
                                ' 
                          value={searchEmail}
                          onChange={e => setSearchEmail(e.target.value)}>
                        </input>
                      </div>
                    </div>

                     <div className='flex justify-end'>
                    <button className='  
                    px-12
                    py-2
                    text-sm text-white
                  bg-emerald-700
                    rounded-lg
                    outline-none
                  hover:bg-emerald-800
                  ring-indigo-300' 
                  onClick={handleSearch}>Buscar</button>
                  </div>
                  <Modal3 isOpen={isModalOpen} onClose={closeModal} />
                </div> )}
               
               <div className="flex flex-col my-4">
                  <label
                    className="inline-flex mb-2 text-sm text-gray-800"
                    htmlFor='type' 
                  >Selecciona Como Te Identificas </label
                  >
                  <select
                    id='type'
                    className="
                      w-full
                      px-3
                      py-2
                      text-gray-800
                      border
                      rounded
                      outline-none
                      bg-gray-50
                      focus:ring
                      ring-emerald-500
                      font-poppins
                    "
                    name="Type" // Nombre del campo relacionado en el estado userData
                    value={userData.Type || ''}
                    onChange={handleFirstSelectChange}
                  >
                    <option value="" hidden>Selecciona Una Opción</option>
                    <option value="Particular">Particular</option>
                    <option value="EPS" >EPS</option>
                    <option value="Visitador Médico" >Visitador Médico</option>
                    <option value="Medicina Prepagada" >Medicina Prepagada</option>
                  </select>

                    
                    {/* IF EPS CLICKED SHOW SECOND SELECT */}

                    {userData.Type === "EPS" && (
                <div className="flex flex-col mt-4">
                    <label 
                    className="inline-flex mb-2 text-sm text-gray-800" 
                    htmlFor='subType' >
                        Selecciona tu EPS
                    </label>
                    <select
                        id='subType'
                        name="subType"
                        className="w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500
                        "
                        value={userData.subType || ""}
                        onChange={handleUserDataChange}
                    >
                        <option value="" hidden>Selecciona una opción</option>
                        <option value="Nueva EPS">Nueva EPS</option>
                    </select>
                </div>
              )}

                {/* IF Medicina Prepagada CLICKED SHOW SECOND SELECT */}

                {userData.Type === "Medicina Prepagada" && (
                <div className="flex flex-col mt-4">
                    <label 
                    className="inline-flex mb-2 text-sm text-gray-800" 
                    htmlFor='subType' >
                        Selecciona a Cual Perteneces
                    </label>
                    <select
                        id='subType'
                        name="subType"
                        className="w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500
                        "
                        value={userData.subType || ""}
                        onChange={handleUserDataChange}
                    >
                        <option value="" hidden>Selecciona una opción</option>
                        <option value="SURA">SURA</option>
                        <option value="RedMedical">RedMedical</option>
                        <option value="MediGold">MediGold</option>
                    </select>
                </div>
              )}

                </div>

                <div className="flex flex-col">
                    <label className="inline-flex mb-2 text-sm text-gray-800">
                        Selecciona el Tipo de Cita
                    </label>
                    {!isVisitadorMedico && (
                      <select
                        className="
                        w-full
                        px-3
                        py-2
                        text-gray-800
                        border
                        rounded
                        outline-none
                        bg-gray-50
                        focus:ring
                        ring-emerald-500
                        "
                        name="Motive" // Nombre del campo relacionado en el estado userData
                        value={userData.Motive || ''}
                        onChange={handleUserDataChange}
                    >
                        <option value="" hidden>Selecciona Una Opción</option>
                        {showCitaValorativa && (
                        <option value="Cita Valorativa Primera vez">Cita Valorativa</option>
                        )}
                        {!isVisitadorMedico && (
                          <option value="Medicina General Primera vez">Medicina General</option>
                        )}
                         {!isVisitadorMedico && (
                          <option value="Ginecologia Primera vez">Ginecología </option>
                        )}
                        <option value="Nutricion Primera vez">Nutrición</option>
                        <option value="Medicina Interna Primera vez">Medicina Interna</option>
                        <option value="Medicina Integral Primera vez">Medicina Integral</option>
                        <option value="Psicologia Primera vez">Psicología</option>
                    </select>
                    )}

                    {isVisitadorMedico && ( 
                    <select
                        className="
                        w-full
                        px-3
                        py-2
                        text-gray-800
                        border
                        rounded
                        outline-none
                        bg-gray-50
                        focus:ring
                        ring-emerald-500
                        "
                        name="Motive" // Nombre del campo relacionado en el estado userData
                        value={userData.Motive || ''}
                        onChange={handleUserDataChange}
                    >
                        <option value="" hidden>Selecciona Una Opción</option>
                        <option value="Toma de Muestras">Entrega de Muestras</option>
                        <option value="Presentación de Nuevos Productos">Presentación de Nuevos Productos</option>
                        <option value="Actualización de Información Científica">Actualización de Información Científica</option>
                        <option value="Recopilación de Datos y Feedback">Recopilación de Datos y Feedback</option>
                        <option value="Seguimiento de Pacientes">Seguimiento de Pacientes</option>
                        <option value="Organización de Eventos y Simposios">Organización de Eventos y Simposios</option>
                        <option value="Promoción de Programas de Apoyo">Promoción de Programas de Apoyo</option>
                        <option value="Colaboración en Investigaciones">Colaboración en Investigaciones</option>
                        <option value="Conocer las Necesidades del Médico">Conocer las Necesidades del Médico</option>
                        <option value="Demostración de Técnicas o Procedimientos">Demostración de Técnicas o Procedimientos</option>
                        <option value="Otro">Otro</option>

                    </select>
                    )}
                    
                </div>


            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <Calendar  
          selectedDate={selectedDate}
          selectedTime={selectedTime} 
          onDateChange={handleDateChange} 
          onTimeChange={handleTimeChange}/>
          </div>
        );
      case 3:
        return (
          <div className='text-justify p-4 '>
            <p>Tipo de Paciente: <span className='font-semibold'>{userData.Type} {userData.Type === "Medicina Prepagada" ? userData.subType : ""} </span> </p>
            {userData.Type === "EPS" && (
            <p>EPS: <span className='font-semibold'> {userData.subType}</span></p>
            )}            
            <p>Motivo: <span className='font-semibold'>{userData.Motive.replace(/Primera vez/g, "").trim()}</span> </p>
            <p>Fecha Seleccionada: <span className='font-semibold'>{selectedDate?.toLocaleDateString()}</span> </p>
            <p>Hora Seleccionada: <span className='font-semibold'>{selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> </p>
          </div>
        );
      default:
        return null;
    }
  };

  const HeaderTitleUser = () => {
    return (
      <h2 className=" mb-4 text-2xl font-bold text-center text-gray-800 lg:text-3xl md:mb-6">
      Señor/a {auth.name} {auth.lastName} { params.id ? <span>ReAgenda</span> : <span>Para Agendar</span> } Tu Cita
      </h2>
    )
  };

  const HeaderTitleEmployees = () => {
      return (
        <h2 className=" mb-4 text-2xl font-bold text-center text-gray-800 lg:text-3xl md:mb-6">
        Completa Los Pasos Para { params.id ? <span>ReAgendar</span> : <span>Agendar</span> } Una Cita  
        </h2>
      )
  };

  const { msg } = alert

  const {msg:msg1} = alert2

  return (  
    <div>
      <div className='mx-auto max-w-screen-md'>
          <header className="my-8">

          {roleUser ? <HeaderTitleUser/> : <HeaderTitleEmployees/>}
          
          <p className="max-w-screen-md mx-auto text-center text-gray-500 md:text-lg">
          {stepText[step]}
          </p>

          </header>

          <Modal4 isOpen={isModalOpen1} onClose={closeModal}/> 

          {msg1 && <Alert2 alert={alert2}/>}

          {msg && <Alert alert={alert}/> }

          {renderStepContent()}

          <div className='flex items-center justify-between mt-4'>
              <div>

                {step <= 1 && (
                  
                  <button
                  to="/Bookings"
                  className="
                  inline-flex
                  items-center
                  px-6
                  py-2
                  text-sm text-gray-800
                  rounded-lg
                  shadow
                  outline-none
                  gap-x-1
                  bg-gray-100
                  hover:bg-gray-200
                  "
                  onClick={() => navigate(-1)}>Volver
                  
                </button>

                )}
              
                  {step > 1 && (
                      
                  <button 
                  className="
                  inline-flex
                  items-center
                  px-6
                  py-2
                  text-sm text-gray-800
                  rounded-lg
                  shadow
                  outline-none
                  gap-x-1
                  bg-gray-100
                  hover:bg-gray-200
                  "
                  onClick={handlePreviousStep}
                  >Paso Anterior</button>
              
                  )}
              </div>
              <div>
                  {step < 3 ? (
                  
                  <button 
                  className="
                      px-6
                      py-2
                      text-sm text-white
                  bg-emerald-700
                      rounded-lg
                      outline-none
                  hover:bg-emerald-800
                  ring-indigo-300
                              "
                  onClick={handleNextStep}>Siguiente Paso</button>
                  
                  )
                  : (
                    <button 
                      className="
                      px-6
                      py-2
                      text-sm text-white
                      bg-emerald-700
                      rounded-lg
                      outline-none
                      hover:bg-emerald-800
                      ring-indigo-300"
                      onClick={handleConfirmCita}
                      disabled={isButtonDisabled}
                      >{ params.id ? <span>Re-Agendar Cita</span> : <span>Confirmar Cita</span> }</button>        
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};



export default Stepper;