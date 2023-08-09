import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import Calendar from "../components/Calendar"
import useAuth from '../hooks/useAuth';
import useBookings from '../hooks/useBookings';
import Alert from '../components/Alert';
import Alert2 from '../components/Alert2'
import { useNavigate } from 'react-router-dom';
import Modal3 from './Modal3';
import Modal4 from './Modal4';
import { parseISO, format } from 'date-fns';
import Modal8 from '../components/Modal8'

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
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showCitaValorativa, setShowCitaValorativa] = useState(false);
  const [isVisitadorMedico, setIsVisitadorMedico] = useState(false);
  const [userFoundNames, setUserFoundNames] = useState(''); 
  const [typeDocument, setTypeDocument] = useState('');
  const [foundUserName, setFoundUserName] = useState('');
  const [foundUserLastName, setFoundUserLastName] = useState('');
  const [foundUserEmail, setFoundUserEmail] = useState('');
  const location = useLocation();
  const { from } = location.state || {};
  const [foundUser, setFoundUser] = useState(null);
  const [planCost, setPlantCost] = useState(0);
  const [planCost2, setPlantCost2] = useState(0);
  const [sections, setSections] = useState([{ id: 1 }]); // Initial section
  const [monthsToPay, setMonthsToPay] = useState(0);

  const formattedTime = selectedTime ? format(selectedTime, 'h:mm a') : null;
  const paymentMethod = sections.map(section => `${section.Motive}${section.subMotive ? ` ${section.subMotive}` : ''} ${section.planCost}`
  ).join(', ');

  console.log(sections, paymentMethod)

  const navigate = useNavigate();
  const params = useParams()
  const { allBookings, submitBooking, bookings, newPlan } = useBookings();
  const { auth, allUsers } = useAuth();
  const roleUser = [auth].some((role) => role.role === "User")
  const roleAdmission = [auth].some((role) => role.role === "Admission")
  const roleAdmin = [auth].some((role) => role.role === "Admin")

  const isResponsable = [auth].some((role) => role.responsable === true)
  const bookingData = allBookings.find(booking => booking._id === params.id) 
  const bookingAuth = allBookings.filter(booking => booking.bookingTo === auth._id)
  const bookingUserAuth = allBookings.filter(booking => booking.bookingTo === foundUserId)

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

  
  const addSection = () => {
    const newSectionId = sections.length + 1;
    setSections([...sections, { id: newSectionId }]);
  };

  const handleNextStep = () => {
    
    // Validar campos antes de pasar al siguiente paso

    if (from !== '/MenuAdmission/CustomPlans') {

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

  }

  if (step === 2 && from === '/MenuAdmission/CustomPlans') {

    const isNumberValid = /^\d+$/.test(planCost);

    const isNumber2Valid = /^\d+$/.test(planCost2);

    if (!isNumberValid || !isNumber2Valid) {
      setAlert({
        msg: 'El monto debe contener solo números.',
        error: true,
      });
      return;
    }

    // Validación para el monto mínimo
    const totalPlantCost = sections.reduce((total, section) => total + parseFloat(section.planCost || 0), 0);
    
    if (totalPlantCost < 3500000) {
      setAlert({
        msg: 'El monto debe llegar al mínimo permitido.',
        error: true,
      });
      return;
    }

    if (monthsToPay == 0) {
      setAlert({
        msg: 'El mínimo de meses a pagar no puede ser 0',
        error: true,
      });
      return;
    }

    // Validación de campos obligatorios en todas las secciones
    if (step === 2 && sections.some(section => !section.Motive)) {
      setAlert({
        msg: 'Completa todos los campos obligatorios antes de continuar.',
        error: true
      });
      return;
    }

    if (step === 3 && (!selectedDate || !selectedTime)) {
      setAlert({
        msg: 'Completa todos los campos obligatorios antes de continuar.',
        error: true
      });
      return
    }

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

  const stepTextEditing = {
    1: "Selecciona una Fecha Disponible.",
    2: "Verifica tus Datos."
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
    const haveMotiveCV = bookingAuth.some(booking => booking.Motive === "Valoración Primera vez");
    const haveMotiveMG = bookingAuth.some(booking => booking.Motive === "Medicina General Primera vez");
    const haveMotiveG = bookingAuth.some(booking => booking.Motive === "Ginecologia Primera vez");

    const haveMotiveNutriAd = bookingUserAuth.some(booking => booking.Motive === "Nutricion Primera vez");
    const haveMotiveMIAd = bookingUserAuth.some(booking => booking.Motive === "Medicina Interna Primera vez");
    const haveMotiveMIGAd = bookingUserAuth.some(booking => booking.Motive === "Medicina Integral Primera vez");
    const haveMotivePGAd = bookingUserAuth.some(booking => booking.Motive === "Psicologia Primera vez");
    const haveMotiveCVAd = bookingUserAuth.some(booking => booking.Motive === "Valoración Primera vez");
    const haveMotiveMGAd = bookingUserAuth.some(booking => booking.Motive === "Medicina General Primera vez");
    const haveMotiveGAd = bookingUserAuth.some(booking => booking.Motive === "Ginecologia Primera vez");
    
    const formattedDateHour = format(dateHour, 'dd/MM/yyyy HH:mm:ss');

        // Verificar si el usuario autenticado es un Visitador Médico si es desde Admission

        if (roleAdmission || roleAdmin) {
          if (userData.Type === "Visitador Médico") {
    
            // Obtener las citas programadas del Visitador Médico para la fecha seleccionada
            const VMforDate = bookingUserAuth
              .filter(booking => booking.Motive === userData.Motive && 
                      booking.dateHour.includes(selectedDate.toISOString().slice(0, 10)));
      
            if (VMforDate.length >= 3) {
              setAlert({
                msg: 'Se ha alcanzado el límite de citas permitidas para Visitadores Medicos para esta fecha.',
                error: true,
              });
              return;
            }
          }
        } else {
          if (userData.Type === "Visitador Médico") {
    
            // Obtener las citas programadas del Visitador Médico para la fecha seleccionada
            const VMforDate = bookingAuth
              .filter(booking => booking.Motive === userData.Motive && 
                      booking.dateHour.includes(selectedDate.toISOString().slice(0, 10)));
      
            if (VMforDate.length >= 3) {
              setAlert({
                msg: 'Se ha alcanzado el límite de citas permitidas para Visitadores Medicos para esta fecha.',
                error: true,
              });
              return;
            }
          }
        }
    

    let updatedMotive;

    if (roleAdmission || roleAdmin) {

      // Determinar el valor adecuado para la propiedad Motive

      if (haveMotiveNutriAd && Motive === "Nutricion Primera vez") {
        updatedMotive = "Nutricion Control";
      } else if (haveMotiveMIAd && Motive === "Medicina Interna Primera vez") {
        updatedMotive = "Medicina Interna Control";
      } else if (haveMotiveMIGAd && Motive === "Medicina Integral Primera vez") {
        updatedMotive = "Medicina Integral Control";
      } else if (haveMotivePGAd && Motive === "Psicologia Primera vez") {
        updatedMotive = "Psicologia Control";
      } else if (haveMotiveCVAd && Motive === "Valoración Primera vez") {
        updatedMotive = "Valoración Control";
      } else if (haveMotiveMGAd && Motive === "Medicina General Primera vez") {
        updatedMotive = "Medicina General Control";
      } else if (haveMotiveGAd && Motive === "Ginecologia Primera vez") {
        updatedMotive = "Ginecologia Control";
      } else {     

          // Si no tiene ninguna cita en ninguna especialidad, entonces mostrar "Nuevo Paciente" para la especialidad actual
          updatedMotive = `${Motive}`;   
      }
    } else {
      
        // Determinar el valor adecuado para la propiedad Motive

        if (haveMotiveNutri && Motive === "Nutricion Primera vez") {
          updatedMotive = "Nutricion Control";
        } else if (haveMotiveMI && Motive === "Medicina Interna Primera vez") {
          updatedMotive = "Medicina Interna Control";
        } else if (haveMotiveMIG && Motive === "Medicina Integral Primera vez") {
          updatedMotive = "Medicina Integral Control";
        } else if (haveMotivePG && Motive === "Psicologia Primera vez") {
          updatedMotive = "Psicologia Control";
        } else if (haveMotiveCV && Motive === "Valoración Primera vez") {
          updatedMotive = "Valoración Control";
        } else if (haveMotiveMG && Motive === "Medicina General Primera vez") {
          updatedMotive = "Medicina General Control";
        } else if (haveMotiveG && Motive === "Ginecologia Primera vez") {
          updatedMotive = "Ginecologia Control";
        } else {     
            // Si no tiene ninguna cita en ninguna especialidad, entonces mostrar "Nuevo Paciente" para la especialidad actual
            updatedMotive = `${Motive}`;   
        }
    }
    

    const target = bookingData?.bookingTo || bookingData?.bookingFor || auth._id
    const paymentMethod = sections.map(section => `${section.Motive}${section.subMotive ? ` ${section.subMotive}` : ''} ${section.planCost}`).join(', ');

    // Pasar los datos hacia el provider

    try {

      // Nuevo plan
      if (monthsToPay != 0) {

      const planData = {
                        soldBy: auth._id, 
                        Target: foundUser._id, 
                        typeOfDocument: foundUser.typeDocument, 
                        Document: foundUser.document, 
                        Plan: Type, 
                        startDate: dateHour, 
                        paymentMethod: paymentMethod, 
                        Status: "Active",
                      }
        
      const actionPlan = {
          realizedBy: auth._id, 
          Target: target, 
          Action: `Nueva subscripcion a ${Type}` 
      }

          newPlan(planData, actionPlan)
        }

      // Si se van a generar citas múltiples

      if (monthsToPay && monthsToPay > 1) {
        const appointments = [];
  
        for (let i = 0; i < monthsToPay; i++) {
          const newDateHour = new Date(dateHour);
          newDateHour.setMonth(dateHour.getMonth() + i);
    
          appointments.push(newDateHour);
        }
  
        appointments.forEach((appointment) => {
          const bookingData1 = {
            dateHour: appointment,
            Type: Type, 
            Motive: "Planes Personalizados",
            bookingTo: foundUserId,
            bookingToName: foundUserName || bookingData?.bookingToName || auth.name,
            bookingToLastName: foundUserLastName || bookingData?.bookingToLastName || auth.lastName,
            bookingToEmail: foundUserEmail || bookingData?.bookingToEmail || '',
          };
  
          if (id !== null) {
            bookingData1.id = id;
          }

          submitBooking(bookingData1, { realizedBy: auth._id, Target: target, Action: `${Motive} para el ${formattedDateHour}` });

          setAlert({
          msg: 'Cita agendada correctamente, ¡te esperamos!',
          error: false,
          });

          setIsButtonDisabled(true);
        }); 
      } else {

        // Si es una cita individual

        const bookingData1 = {
          dateHour,
          Type,
          subType,
          Motive: updatedMotive || "Planes Personalizados",
          bookingTo: foundUserId,
          bookingToName: foundUserName || bookingData?.bookingToName || auth.name,
          bookingToLastName: foundUserLastName || bookingData?.bookingToLastName || auth.lastName,
          bookingToEmail: foundUserEmail || bookingData?.bookingToEmail || '',
        };
  
        if (id !== null) {
          bookingData1.id = id;
        }
  
        submitBooking(bookingData1, { realizedBy: auth._id, Target: target, Action: `${Motive} para el ${formattedDateHour}` });
        
        setAlert({
          msg: 'Cita agendada correctamente, ¡te esperamos!',
          error: false,
          });

        setIsButtonDisabled(true);
      }
    } catch (error) {
      setIsModalOpen2(false)

      console.log(error)
    }
    };
     
  const handleSearch = (e) => {

    e.preventDefault();

    const found = allUsers.find(user => user.document === parseInt(searchEmail));

    const documentTypeVerification = allUsers.some((user) => user.typeDocument === typeDocument)

    const userFoundNames =  `${found.name} ${found.secondName} ${found.lastName} ${found.secondLastName} ${found.typeDocument}: ${found.document}`
    
      if (found && documentTypeVerification) {
        
        setFoundUserId(found._id);
        setFoundUserName(found.name)
        setFoundUserLastName(found.lastName)
        setFoundUserEmail(found.email)
        setFoundUser(found)
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

  const StepOneNewBooking = () => {
    return (
      <>
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

                 {/* IF Visitador medico CLICKED SHOW SECOND SELECT */}

                 {userData.Type === "Visitador Médico" && (
                <div className="flex flex-col mt-4">
                    <label 
                    className="inline-flex mb-2 text-sm text-gray-800" 
                    htmlFor='subType' >
                        Selecciona a Cual Laboratorio Perteneces
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
                        <option value="Boehringer Ingelheim">Boehringer Ingelheim</option>
                        <option value="Lilly">Lilly</option>
                        <option value="NovoNordisk">NovoNordisk</option>
                        <option value="MK">MK</option>
                        <option value="Pfizer">Pfizer</option>
                        <option value="Sanofi">Sanofi</option>
                        <option value="Siegfried">Siegfried</option>
                        <option value="Diabetrics">Diabetrics</option>
                        <option value="Procaps">Procaps</option>
                        <option value="Closter Farma">Closter Farma</option>
                        <option value="Bayer">Bayer</option>
                        <option value="Euroetika">Euroetika</option>
                        <option value="Huma Farmacéutica">Huma Farmacéutica</option>
                        <option value="Abbott">Abbott</option>
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
                        <option value="Valoración Primera vez">Valoración</option>
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
      </>
    )
  };

  const StepOneNewSubscription = () => {
    return (
      <>
 
     {/* User Data */}

     {foundUser && (
      <div className=''>
        <div class="flex max-w-5xl py-6 px-4 mx-4 sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto my-16 bg-white shadow-xl rounded-lg text-gray-900">
          <div class="rounded-t-lg ml-6 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className='w-full flex justify-center items-center flex-col'>
          <div class="text-justify mt-2">
              <p class="text-gray-500">
                <span class="font-semibold">Email:</span> {foundUser.email}
              </p>
              <h2 class="text-gray-500">
                <span class="font-semibold">Nombre:</span> {foundUser.name} {foundUser.secondName} {foundUser.lastName} {foundUser.secondLastName}
              </h2>
              <p class="text-gray-500">
                <span class="font-semibold">Dirección:</span> {foundUser.address}
              </p>
              <p class="text-gray-500">
                <span class="font-semibold">Estado Civil:</span> {foundUser.civilStatus}
              </p>
              <p class="text-gray-500">
                <span class="font-semibold">Documento:</span> {foundUser.typeDocument} {foundUser.document}
              </p>
              <p class="text-gray-500">
                <span class="font-semibold">Tipo de Sangre:</span> {foundUser.typeOfBlood}
              </p>
              <p class="text-gray-500">
                <span class="font-semibold">Número Telefónico:</span> {foundUser.phoneNumber}
              </p>
              <p class="text-gray-500">
                <span class="font-semibold">Fecha de Nacimiento:</span> {format(new Date(foundUser.dateOfBirth), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
     )}

      </>
    )
  };

  const renderStepContent = () => {

    if ((roleUser && !params.id) || ((roleAdmission || roleAdmin) && from !== '/MenuAdmission/CustomPlans')) {
    switch (step) {
      case 1:
        return (
          <div>
            <form className='max-w-screen-md mx-auto'>

              {/* Info Verification */}

              {(!roleUser && !params.id) && (  
                <div className='flex flex-col my-4'>
                    <div className='flex gap-2'>
                      <div className='flex-[1%] mt-8'>
                                      <select
                                        id="emailV"
                                        className="text-center font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={typeDocument}
                                        onChange={e => setTypeDocument(e.target.value)}
          
                                      >🡣
                                        <option value="" hidden >▼</option>
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
                </div> 
              )}

              {/* Normal Booking */}

                {from !== '/MenuAdmission/CustomPlans' && (
                  <form>
                    <StepOneNewBooking/>
                  </form>
                )}

              {/* Subscription Plan Booking */}

              {from === '/MenuAdmission/CustomPlans' && (
                  <form>
                    <StepOneNewSubscription/>
                  </form>
                )}
                  
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
            <p>Hora Seleccionada: <span className='font-semibold'>{formattedTime}</span> </p>
          </div>
        );
      default:
        return null;
    }
  } else if (roleUser && params.id) {
     switch (step) {
      case 1:
        return (
          <div>
            <Calendar  
          selectedDate={selectedDate}
          selectedTime={selectedTime} 
          onDateChange={handleDateChange} 
          onTimeChange={handleTimeChange}/>
          </div>
        );
      case 2:
        return (
          <div className='text-justify p-4 '>
            <p>Tipo de Paciente: <span className='font-semibold'>{userData.Type} {userData.Type === "Medicina Prepagada" ? userData.subType : ""} </span> </p>
            {userData.Type === "EPS" && (
            <p>EPS: <span className='font-semibold'> {userData.subType}</span></p>
            )}            
            <p>Motivo: <span className='font-semibold'>{userData.Motive.replace(/Primera vez/g, "").trim()}</span> </p>
            <p>Fecha Seleccionada: <span className='font-semibold'>{selectedDate?.toLocaleDateString()}</span> </p>
            <p>Hora Seleccionada: <span className='font-semibold'>{formattedTime}</span> </p>
          </div>
        );
      default:
        return null;
    }
  } else if (from === '/MenuAdmission/CustomPlans') {
    switch (step) {
      case 1:
        return (
          <div>
            <form className='max-w-screen-md mx-auto'>

              {/* Info Verification */}

              {(!roleUser && !params.id) && (  
                <div className='flex flex-col my-4'>
                    <div className='flex gap-2'>
                      <div className='flex-[1%] mt-8'>
                                      <select
                                        id="emailV"
                                        className="text-center font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={typeDocument}
                                        onChange={e => setTypeDocument(e.target.value)}
          
                                      >🡣
                                        <option value="" hidden >▼</option>
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
                </div> 
              )}

              {/* Subscription Plan Booking */}

              <StepOneNewSubscription/>
              
            </form>
          </div>
        );
      case 2:
        return (
          <>
            <div className='grid-cols-2 gap-8 my-4'>
                    
                    {/* Plans to choose */}

                    <div className="flex flex-row mb-4 gap-4 text-left">
                          <div className='flex-[100%] '>
                              <label
                                className="inline-flex mb-2 text-sm text-gray-800"
                                htmlFor='type' 
                              >Planes a Elegir</label
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
                                <option value="Diabetes">Diabetes</option>
                                <option value="Optimización Corporal" >Optimización Corporal</option>
                                <option value="Obesidad" >Obesidad</option>
                              </select>
                          </div>

                          <div className="flex flex-[20%] flex-col mb-4">
                              <label
                                className="inline-flex mb-2 text-sm text-gray-800"
                                htmlFor='type' 
                              >Meses a pagar</label
                              >
                              <input
                                type='Number'
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
                                value={monthsToPay}
                                onChange={e => setMonthsToPay(e.target.value)}
                              >
                              </input>
                          </div>
                    </div>
                  
                    {/* Inputs */}
                            
                    {sections.map((section, index) => (
                          <div key={section.id} className="flex gap-6">
                                                    
                              {/* Payment Method */}
                              
                              <div className="flex flex-row gap-4 text-left mb-4">
                                        <div>
                                          <label className="text-left text-sm mb-2 text-gray-800">
                                              Métodos de Pago
                                          </label>
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
                                              mt-1
                                              "
                                              name="Motive" // Nombre del campo relacionado en el estado userData
                                              value={section.Motive || ''}
                                              onChange={(e) => {
                                                const newSections = [...sections];
                                                newSections[section.id - 1].Motive = e.target.value;
                                                setSections(newSections);
                                              }}
                                          >
                                              <option value="" hidden>Selecciona Una Opción</option>                                            
                                              <option value="Datáfono">Datáfono</option>
                                              <option value="Efectivo">Efectivo</option>
                                              <option value="Transferencia">Transferencia</option>
                                              <option value="Financiado">Financiado</option>
                                          </select> 
                                        </div> 

                                          {section.Motive === "Datáfono" && (
                                            <div className="flex-[60%] flex-col">
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
                                                    value={section.subMotive || ''}
                                                    onChange={(e) => {
                                                      const newSections = [...sections];
                                                      newSections[section.id - 1].subMotive = e.target.value;
                                                      setSections(newSections);
                                                    }}
                                                >
                                                    <option value="" hidden>Selecciona una opción</option>
                                                    <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                                                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                                                </select>
                                            </div>
                                          )}  

                                          {section.Motive === "Transferencia" && (
                                            <div className="flex-[60%] flex-col">
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
                                                    value={section.subMotive || ''}
                                                    onChange={(e) => {
                                                      const newSections = [...sections];
                                                      newSections[section.id - 1].subMotive = e.target.value;
                                                      setSections(newSections);
                                                    }}
                                                >
                                                    <option value="" hidden>Selecciona una opción</option>
                                                    <option value="Bancolombia">Bancolombia</option>
                                                    <option value="Davivienda">Davivienda</option>
                                                </select>
                                            </div>
                                          )}    

                                          {section.Motive === "Financiado" && (
                                            <div className="flex-[60%] flex-col">
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
                                                    value={section.subMotive || ''}
                                                    onChange={(e) => {
                                                      const newSections = [...sections];
                                                      newSections[section.id - 1].subMotive = e.target.value;
                                                      setSections(newSections);
                                                    }}
                                                >
                                                    <option value="" hidden>Selecciona una opción</option>
                                                    <option value="Sistecredito">Sistecredito</option>
                                                </select>
                                            </div>
                                          )}                                                                  
                              </div>

                              {/* Amount and Button + */}

                              <div className='flex flex-row'>  

                              <div className="flex flex-col">
                                <label className="inline-flex text-sm mb-2 text-gray-800">
                                  Ingresa el Monto
                                </label>
                                <input
                                  type="number"
                                  placeholder="Ingresar Monto"
                                  className="w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500"
                                  // You can use section.id to uniquely identify inputs for each section
                                  value={sections[section.id - 1].planCost || ''}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[section.id - 1].planCost = e.target.value;
                                    setSections(newSections);
                                  }}
                                />
                              </div>

                                {/* More Inputs button */}

                                {index === 0 && (   
                                <div className='flex justify-center items-center mt-3.5 ml-4'>
                                    <button  onClick={addSection}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
                                    </svg>
                                    </button>
                                </div> )}

                               {/*  {index >= 1 && (   
                                <div className='flex justify-center items-center mt-6 ml-4'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8">
                                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
                                    </svg>
                                </div> )}
                                */}
                            
                              </div>
                        </div>
                    ))}
                  
            </div>
          </>
        );
      case 3:
        return (
          <div>
            <Calendar  
          selectedDate={selectedDate}
          selectedTime={selectedTime} 
          onDateChange={handleDateChange} 
          onTimeChange={handleTimeChange}/>
          </div>
        );
      case 4:
        return (
          <div className='text-justify'>
            <div class="mx-auto p-16">
              <div className="flex items-center justify-between mb-8 px-3">
              <div>
                <span className="text-2xl">Subscripción a {userData.Type}</span> <br />
                {selectedDate?.toLocaleDateString()}<br />
              </div>
              <div className="w-20">
                  <svg
                    id="Capa_2"
                    data-name="Capa 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 246.82 220.08"
                  >
                    <defs>
                      <style>{"\n      .cls-1 {\n        fill: #00a451;\n      }\n    "}</style>
                    </defs>
                    <g id="Capa_1-2" data-name="Capa 1">
                      <path
                        className="cls-1"
                        d="m246.82,220.08c-17.81-.25-34.14-12.55-46.89-32.9-10.53-16.78-18.63-39.03-23.15-64.51-2.62-14.72-4.04-30.52-4.04-46.97-2.01,4.93-4.93,11.21-7.17,18.17l-21.54,65.95c-2.3,7.06-5.07,13.84-7.89,19.39-2.47,4.89-7.49,7.97-12.97,7.97-10.09,0-19.07-7.85-24.68-24.45l-1.78-5.24v-.02l-20.2-59.57c-2.69-7.85-6.28-17.04-8.52-22.43-4.04,21.99-6.73,83.67-6.73,111.71h-10.77c-6.67,0-12.12-2.51-15.5-7.19-2.43-3.34-3.79-7.79-3.79-13.22,0-32.07,9.71-100.39,15.06-133.25.03-.17.05-.32.07-.46C31.75,15.02,15.65,3.17,0,.3c28.41-2.75,56.11,13.41,78.17,40.9,5.66,7.05,10.95,14.85,15.79,23.27,13.79,23.99,23.89,52.99,28.37,84.04-.02.09-.03.18-.05.27h-.02s.01.03.01.04c0-.01,0-.03,0-.04l.09-.03c-.01-.08-.02-.16-.04-.24,1.12-5.69,2.66-10.32,4.2-15.39l17.73-54.51c6.69-20.86,14.86-35.19,21.02-42.15,1.66-1.88,4.06-2.94,6.57-2.94,17.05,0,28.26,10.77,30.73,31.86,0,27.86,2.13,53.98,5.85,76.55,7.63,46.16,21.93,77.43,38.39,78.15Z"
                      />
                    </g>
                  </svg>
              </div>
              </div>

              <div className="flex justify-between mb-8 px-3">
                <div>
                  <p>Nombre: <span className='font-semibold'>{foundUser.name} {foundUser.secondName} {foundUser.lastName} {foundUser.secondLastName} </span> </p>
                  <p>Email: <span className='font-semibold'>{foundUser.email}</span> </p>
                  <p>Plan Personalizado: <span className='font-semibold'>{userData.Type}</span> </p>        
                </div>
                <div className="text-right">
                  <p>Fechas Seleccionadas: <span className='font-semibold'> {selectedDate?.toLocaleDateString()}</span> </p>
                  <p>Horas Seleccionadas: <span className='font-semibold'> {formattedTime}</span> </p> 
                </div>
              </div>

              <div className="border border-t-2 border-gray-200 mb-8 px-3"></div>

              <div className="mb-8 px-3">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam vestibulum elit, id rutrum sem lobortis eget. In a massa et leo vehicula dapibus. In convallis ut nisi ut vestibulum. Integer non feugiat tellus. Nullam id ex suscipit, volutpat sapien tristique, porttitor sapien.</p>
              </div>

              {sections.map((section) => (
                <div key={section.id} className="flex justify-between mb-4 bg-gray-200 px-3 py-2">
                  <div>
                  {section.Motive}  
                  {section.subMotive ? ` - ${section.subMotive}` 
                  : ''} </div>
                  <div className="text-right font-medium">{section.planCost}</div>
                </div>
              ))}

              <div className="flex justify-between items-center mb-2 px-3">
                <div className="text-2xl leading-none"><span className="">Total</span>:</div>
                <div className="text-2xl text-right font-medium">
                {sections.reduce((total, section) => total + parseFloat(section.planCost), 0)}
                  </div>
              </div>          
            </div>  
          </div>
                );
      default:
        return null;
    }
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

      <Modal4 isOpen={isModalOpen1}/> 

      <Modal8 isOpen={isModalOpen2} />

      {!isResponsable && (
        <div className='mx-auto max-w-screen-md'>
        <header className="my-8">

        {roleUser ? <HeaderTitleUser/> : <HeaderTitleEmployees/>}
        
        <p className="max-w-screen-md mx-auto text-center text-gray-500 md:text-lg">
        {(roleUser && params.id) ? stepTextEditing[step] : stepText[step]}
        </p>

        </header>

        {msg1 && <Alert2 alert={alert2}/>}

        {msg && <Alert alert={alert}/> }

        {renderStepContent()}

        {((roleUser && !params.id) || (roleAdmission || roleAdmin)) && from !== '/MenuAdmission/CustomPlans' && (
           <div className='flex items-center justify-between mt-4'>
           <div>

             {step <= 1 && (
               
               <button
               to="/Menu"
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
        )}

        {(from === '/MenuAdmission/CustomPlans' && foundUser) &&  (
           <div className='flex items-center justify-between mt-4'>
           <div>

             {step <= 1 && (
               
               <button
               to="/Menu"
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
               {step < 4 ? (
               
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
        )}

        {(roleUser && params.id) && (
           <div className='flex items-center justify-between mt-4'>
           <div>

             {step <= 1 && (
               
               <button
               to="/Menu"
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
               {step < 2 ? (
               
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
        )}
      </div>
      )}
    
    </div>
  );
};



export default Stepper;