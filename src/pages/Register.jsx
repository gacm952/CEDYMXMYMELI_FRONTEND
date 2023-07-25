import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Alert2 from '../components/Alert2'
import costumerAxios from '../config/costumerAxios'
import useAuth from '../hooks/useAuth'

const Register = () => {

  const [name, setName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [typeDocument, setTypeDocument] = useState('')
  const [typeDocument2, setTypeDocument2] = useState('')
  const [document, setDocument] = useState('')
  const [lastName, setLastName] = useState('')
  const [secondLastName, setSecondLastName] = useState('')
  const [email, setEmail] = useState('')
  const [emailV, setEmailV] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [civilStatus, setCivilStatus] = useState('')
  const [typeOfBlood, setTypeOfBlood] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [legalTerms, setLegalTerms] = useState(false)
  const { auth, allUsers } = useAuth();
  const [alert, setAlert] = useState({})
  const [alert2, setAlert2] = useState({})
  const [fathersForm, setfathersForm] = useState(false);

  const navigate = useNavigate();
  const roleUser = [auth].some((role) => role.role === "User")
  const roleAdmission = [auth].some((role) => role.role === "Admission")

  const handleSubmit = async e => {
      e.preventDefault();

      const toTitleCase = input => input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
      const toLowerCaseEmail = input => input.toLowerCase();

      function passwordValidation(password) {
        const haveLetter = /[A-Za-z]/.test(password);
        const haveNumber = /\d/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSymbol = /[@$!%*?&]/.test(password);
        const isValid = /^[A-Za-z\d@$!%*?&]{8,}$/.test(password);
      
        if (!haveLetter) {
          return "La contraseña debe contener al menos una letra.";
        }
        if (!haveNumber) {
          return "La contraseña debe contener al menos un número.";
        }
        if (!hasUppercase) {
          return "La contraseña debe contener al menos una mayúscula.";
        }
        if (!hasSymbol) {
          return "La contraseña debe contener al menos un símbolo (@, $, !, %, *, ?, o &).";
        }
        if (!isValid) {
          return "La contraseña debe ser de mínimo 8 caracteres y no contener caracteres especiales.";
        }
      }

      const passwordError = passwordValidation(password);


      if (!roleAdmission) {
        if ([password, confirmPassword].includes('')) {
          setAlert({
            msg: 'todos los campos son obligatorios',
            error: true,
          })
          return 
        }

        if (password !== confirmPassword) {
          setAlert({
            msg: 'las contraseñas no son iguales',
            error: true,
          })
          return
        }
  
        if (password.length < 8) {
          setAlert({
            msg: 'La contraseña es muy corta, agrega mínimo 8 caracteres',
            error: true,
          })
          return
        }

        if (passwordError) {
          setAlert({
            msg: passwordError,
            error: true,
          });
          return;
        }
        
        if (legalTerms === false) {
          console.log(legalTerms)
          setAlert({
            msg: 'Debes aceptar los terminos y condiciones',
            error: true,
          })
          return 
        }
      }

      if(document.length < 4) {
        setAlert({
          msg: 'El documento no puede ser muy corto',
          error: true,
        })
        return
      }

      if ([typeDocument, document, name,
          secondName, lastName, secondLastName, 
          email, phoneNumber, address, dateOfBirth, 
          civilStatus, typeOfBlood].includes('')) {
        setAlert({
          msg: 'todos los campos son obligatorios',
          error: true,
        })
        return 
      }

      const isDocumentValid = /^\d+$/.test(document);
      const isPhoneNumberValid = /^\d+$/.test(phoneNumber);
      const isNameValid = /^[A-Za-z]+$/.test(name);
      const isSecondNameValid = /^[A-Za-z]+$/.test(secondName);
      const isLastNameValid = /^[A-Za-z]+$/.test(lastName);
      const isSecondLastNameValid = /^[A-Za-z]+$/.test(secondLastName);

      if (!isNameValid) {
        setAlert({
          msg: 'El campo "Nombre" debe contener solo letras.',
          error: true,
        });
        return;
      }
      
      if (!isSecondNameValid) {
        setAlert({
          msg: 'El campo "Segundo Nombre" debe contener solo letras.',
          error: true,
        });
        return;
      }
      
      if (!isLastNameValid) {
        setAlert({
          msg: 'El campo "Apellido" debe contener solo letras.',
          error: true,
        });
        return;
      }
      
      if (!isSecondLastNameValid) {
        setAlert({
          msg: 'El campo "Segundo Apellido" debe contener solo letras.',
          error: true,
        });
        return;
      }

      if (!isDocumentValid) {
        setAlert({
          msg: 'El campo "Documento" debe contener solo números.',
          error: true,
        });
        return;
      }
      
      if (!isPhoneNumberValid) {
        setAlert({
          msg: 'El campo "Número de teléfono" debe contener solo números.',
          error: true,
        });
        return;
      }


      setAlert({})

      // Crear el User
       
      try {
       
        const { data } = await costumerAxios.post(`/register`,
        { password, 
          typeDocument, 
          document, 
          name: toTitleCase(name),
          secondName: toTitleCase(secondName),
          lastName: toTitleCase(lastName),
          secondLastName: toTitleCase(secondLastName),
          email: toLowerCaseEmail(email),
          phoneNumber, 
          address, 
          dateOfBirth, 
          civilStatus, 
          typeOfBlood, 
          registeredBy: auth._id }) 

        await costumerAxios.post('/updateaction', {realizedBy: auth._id })

        setAlert({
          msg: data.msg,
          error: false
        })

        setTimeout(() => {
          setAlert({})
          if(!roleAdmission){
            navigate("/")
          }
        }, 5000);

        // Reiniciar el formulario

       setName('')
        setSecondName('')
        setTypeDocument('')
        setDocument('')
        setSecondLastName('')
        setLastName('')
        setPhoneNumber('')
        setAddress('')
        setDateOfBirth('')
        setCivilStatus('')
        setTypeOfBlood('')
        setEmail('')
        setPassword('')
        setLegalTerms(false)
        setConfirmPassword('')

      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

  const handleSubmitVerificar = async e => {

    e.preventDefault();

    if ([emailV, typeDocument2].includes('')) {

      setAlert2({
        msg: 'todos los campos son obligatorios',
        error: true,
      });

      setTimeout(() => {
        setAlert2({});
      }, 5000); 

      return 

    }

    const emailVerification = allUsers.some((user) => user.document === parseInt(emailV))
    const documentTypeVerification = allUsers.some((user) => user.typeDocument === typeDocument2)

      if (emailVerification && documentTypeVerification) {
        setAlert2({
          msg: "SI EXISTE EL USUARIO",
          error: false
        }) 
        setTimeout(() => {
          setAlert2({});
        }, 3000); 
      } else {
        setAlert2({
          msg: 'NO EXISTE EL USUARIO',
          error: true,
        });
  
        setTimeout(() => {
          setAlert2({});
        }, 3000); 
  
        return
      }
  }

 {/* const handleChildrenDocumento = (event) => {
    setDocumento(event.target.value);
    if (event.target.value === "Tarjeta de Identidad") {
      setfathersForm(true);
    } else {
      setfathersForm(false);
    }
  };  */} 

  const {msg} = alert

  const {msg:msg1} = alert2

  return (
    <>

    {roleAdmission && (
        <section className='w-full min-h-screen flex-grow flex justify-center items-center'>
                    
          <div className='grid grid-cols-2 items-center'>

            <div className='flex flex-col justify-center p-12 shadow-md shadow-gray-600 border-2 border-emerald-600 rounded-3xl w-96 h-82 mx-auto'>
              <h3 className='text-4xl mb-10 uppercase text-center font-extrabold font-poppins text-gray-900'>Verificador de Usuarios</h3>
              <form onSubmit={handleSubmitVerificar}>
                <div className='flex gap-2'>

                <div className='flex-[33%] mt-0.5'>
                                <select
                                  id="emailV"
                                  className="text-center font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={typeDocument2}
                                  onChange={e => setTypeDocument2(e.target.value)}
    
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
                                  <option value="EX">EX</option>

                                </select>
                </div>

                <div>
                
                  <input
                    autoComplete="on"
                    id='documento' 
                    type="text" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="# Documento"
                    value = {emailV}
                    onChange = {e => setEmailV(e.target.value)}
                />
                </div>

              </div>

              <button type="submit" 
              className="mt-4 w-full py-3 uppercase font-bold bg-emerald-600 text-white hover:bg-emerald-800"
              > Verificar </button>

              </form>

              {msg1 && <Alert2 alert={alert2}/>}

            </div>   

            <div className="flex justify-center items-center mx-auto max-w-screen-2xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">  
              <div className="grid">
                <div className="flex justify-center max-w-2xl shadow-md shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
                  <div className="p-8 sm:p-16 lg:py-24 lg:px-16">
      
                    <h2 className="text-3xl text-center  uppercase font-extrabold sm:text-5xl font-poppins text-gray-900 mb-12"
                    >Registrar <br /> Nuevo Usuario</h2> 
                  

                    {msg && <Alert alert={alert}/>}

                      <div className="mt-6 font-poppins">
                        <form onSubmit={handleSubmit} className="space-y-1" >
                              <div className="mb-2 grid grid-cols-1 lg:grid-cols-2 lg:gap-3">
                            
                              <div className=''>
                                <label htmlFor="documento" className="block font-semibold font text-gray-700">
                                Tipo de Documento 
                                </label>
                                <select
                                  id="documento"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={typeDocument}
                                  onChange={e => setTypeDocument(e.target.value)}
    
                                >
                                  <option value="" hidden>Tipo de Documento</option>
                                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                  <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                                  <option value="Registro Único Tributario">Registro Único Tributario</option>
                                  <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                                  <option value="Registro Civil de Nacimiento">Registro Civil de Nacimiento</option>
                                  <option value="Numero de Identificación Tributaria">Numero de Identificación Tributaria</option>
                                  <option value="Permiso Especial de Permanencia">Permiso Especial de Permanencia</option>
                                  <option value="Permiso de Protección Temporal">Permiso de Protección Temporal</option>
                                  <option value="Pasaporte">Pasaporte</option>
                                  <option value="Libreta Militar">Libreta Militar</option>
                                  <option value="Extranjero Sin Identificación">Extranjero Sin Identificación</option>

                                </select>
                              </div>
                              
                              {fathersForm && (
                                  <>
                                  <div>
                                    <label htmlFor="input1" className="block font-medium text-gray-700">
                                      # Documento
                                    </label>
                                    <input
                                      id="input1"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  </div>

                                  <div>
                                    <label htmlFor="input2" className="block font-medium text-gray-700">
                                      Primer Nombre
                                    </label>
                                    <input
                                      id="input2"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input3" className="block font-medium text-gray-700">
                                      Segundo Nombre
                                    </label>
                                    <input
                                      id="input3"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input4" className="block font-medium text-gray-700">
                                      Primer Apellido 
                                    </label>
                                    <input
                                      id="input4"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input5" className="block font-medium text-gray-700">
                                      Segundo Apellido
                                    </label>
                                    <input
                                      id="input5"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>

                                    
                                    <p className='col-span-2 text-center my-6'>Datos del representante legal</p>
                                    
                                  </>  
                                )}

                                <div className=''>
                                    <label 
                                    htmlFor="Documento" 
                                    className="block font-semibold text-gray-700"> # Documento
                                    </label>
                                    <input 
                                      id='Documento'
                                      type="text" 
                                      className=" mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="# Documento"
                                      value = {document}
                                      onChange = {e => setDocument(e.target.value)} 
                                    />
                                </div>

                                  <div>
                                    <label 
                                    htmlFor="Nombre" 
                                    className="block font-semibold text-gray-700"> Primer Nombre
                                    </label>
                                    <input 
                                      id='Nombre'
                                      type="text" 
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Primer Nombre"
                                      value = {name}
                                      onChange = {e => setName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label 
                                    htmlFor="SegundoNombre" 
                                    className="block font-semibold text-gray-700">Segundo Nombre
                                    </label>
                                    <input 
                                      id='SegundoNombre'
                                      type="text" 
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Segundo Nombre"
                                      value = {secondName}
                                      onChange = {e => setSecondName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="Apellido" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Primer Apellido
                                  </label>
                                  <input 
                                    id='Apellido'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Primer Apellido"
                                    value = {lastName}
                                    onChange = {e => setLastName(e.target.value)} 
                                  />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="SegundoApellido" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Segundo Apellido
                                  </label>
                                  <input 
                                    id='SegundoApellido'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Segundo Apellido"
                                    value = {secondLastName}
                                    onChange = {e => setSecondLastName(e.target.value)} 
                                  />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="email" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Email
                                  </label>
                                  <input
                                    autoComplete="on"
                                    id='email' 
                                    type="email" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Email"
                                    value = {email}
                                    onChange = {e => setEmail(e.target.value)}
                                  />
                                </div> 

                                <div>
                                  <label 
                                  htmlFor="phoneNumber" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0"># Teléfono
                                  </label>
                                  <input 
                                    id='phoneNumber'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="# Teléfono"
                                    value = {phoneNumber}
                                    onChange = {e => setPhoneNumber(e.target.value)} 
                                  />
                                </div>     

                                <div>
                                  <label 
                                  htmlFor="address" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Dirección
                                  </label>
                                  <input 
                                    id='address'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Dirección"
                                    value = {address}
                                    onChange = {e => setAddress(e.target.value)} 
                                  />
                                </div>  

                                <div>
                                  <label 
                                  htmlFor="dateOfBirth" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Fecha de Nacimiento
                                  </label>
                                  <input 
                                    id='dateOfBirth'
                                    type="Date" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value = {dateOfBirth}
                                    onChange = {e => setDateOfBirth(e.target.value)} 
                                    min={"1925-01-01"}
                                    max={new Date().toISOString().split('T')[0]}
                                  />
                                </div>    

                                <div>
                                  <label 
                                  htmlFor="civilStatus" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Estado Civil
                                  </label>

                                  <select
                                  id="civilStatus"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={civilStatus}
                                  onChange={e => setCivilStatus(e.target.value)}
                                >
                                    <option value="" hidden>Estado Civil</option>
                                    <option value="Soltero/a">Soltero/a</option>
                                    <option value="Casado/a">Casado/a</option>
                                    <option value="Divorciado/a">Divorciado/a</option>
                                    <option value="Viudo/a">Viudo/a</option>
                                  </select>
                               
                                </div>

                                <div>
                                  <label 
                                  htmlFor="typeOfBlood" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Tipo de Sangre
                                  </label>

                                  <select
                                  id="typeOfBlood"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={typeOfBlood}
                                  onChange={e => setTypeOfBlood(e.target.value)}
                                >
                                  <option value="" hidden>Tipo de Sangre</option>
                                  <option value="A">A</option>
                                  <option value="A+">A+</option>
                                  <option value="A-">A-</option>
                                  <option value="B">B</option>
                                  <option value="B+">B+</option>
                                  <option value="B-">B-</option>
                                  <option value="AB">AB</option>
                                  <option value="AB+">AB+</option>
                                  <option value="AB-">AB-</option>
                                  <option value="O">O</option>
                                  <option value="O+">O+</option>
                                  <option value="O-">O-</option>

                                </select>
                                
                                </div>
                                                                      
                          </div>
                          <div>
                              <button type="submit" className="mt-6 w-full py-3 uppercase font-bold bg-emerald-600 text-white hover:bg-emerald-800"> Registrar Nuevo Usuario </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>

        </section> 
    )}

    {!roleAdmission && (
        <div className="flex justify-center items-center mx-auto max-w-screen-2xl px-4 py-6 sm:pb-8 sm:pt-20 sm:px-6 lg:px-8">  
        <div className="grid">
          <div className="flex justify-center max-w-2xl shadow-md shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
            <div className="p-8 sm:p-16 lg:py-24 lg:px-16">
             
              <h2 className="uppercase text-3xl text-center font-extrabold sm:text-5xl font-poppins text-gray-900 mb-8"
              >Registro</h2> 
            

              {msg && <Alert alert={alert}/>}

              <div className="mt-12 font-poppins">
                <form onSubmit={handleSubmit} className="space-y-1" >
                  <div className="mb-2 grid grid-cols-1 lg:grid-cols-2 lg:gap-3">                             
                              <div className=''>
                                <label htmlFor="documento" className="block font-semibold font text-gray-700">
                                Tipo de Documento
                                </label>
                                <select
                                  id="documento"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={typeDocument}
                                  onChange={e => setTypeDocument(e.target.value)}
    
                                >
                                  <option value="" hidden>Tipo de Documento</option>
                                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                  <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                                  <option value="Registro Único Tributario">Registro Único Tributario</option>
                                  <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                                  <option value="Registro Civil de Nacimiento">Registro Civil de Nacimiento</option>
                                  <option value="Numero de Identificación Tributaria">Numero de Identificación Tributaria</option>
                                  <option value="Permiso Especial de Permanencia">Permiso Especial de Permanencia</option>
                                  <option value="Permiso de Protección Temporal">Permiso de Protección Temporal</option>
                                  <option value="Pasaporte">Pasaporte</option>
                                  <option value="Libreta Militar">Libreta Militar</option>
                                  <option value="Extranjero Sin Identificación">Extranjero Sin Identificación</option>

                                </select>
                              </div>
                              
                              {fathersForm && (
                                  <>
                                  <div>
                                    <label htmlFor="input1" className="block font-medium text-gray-700">
                                      # Documento
                                    </label>
                                    <input
                                      id="input1"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  </div>

                                  <div>
                                    <label htmlFor="input2" className="block font-medium text-gray-700">
                                      Primer Nombre
                                    </label>
                                    <input
                                      id="input2"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input3" className="block font-medium text-gray-700">
                                      Segundo Nombre
                                    </label>
                                    <input
                                      id="input3"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input4" className="block font-medium text-gray-700">
                                      Primer Apellido 
                                    </label>
                                    <input
                                      id="input4"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="input5" className="block font-medium text-gray-700">
                                      Segundo Apellido
                                    </label>
                                    <input
                                      id="input5"
                                      type="text"
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    </div>

                                    
                                    <p className='col-span-2 text-center my-6'>Datos del representante legal</p>
                                    
                                  </>  
                                )}

                                <div className=''>
                                    <label 
                                    htmlFor="Documento" 
                                    className="block font-semibold text-gray-700"> # Documento
                                    </label>
                                    <input 
                                      id='Documento'
                                      type="text" 
                                      className=" mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="# Documento"
                                      value = {document}
                                      onChange = {e => setDocument(e.target.value)} 
                                    />
                                </div>

                                  <div>
                                    <label 
                                    htmlFor="Nombre" 
                                    className="block font-semibold text-gray-700"> Primer Nombre
                                    </label>
                                    <input 
                                      id='Nombre'
                                      type="text" 
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Primer Nombre"
                                      value = {name}
                                      onChange = {e => setName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label 
                                    htmlFor="SegundoNombre" 
                                    className="block font-semibold text-gray-700">Segundo Nombre
                                    </label>
                                    <input 
                                      id='SegundoNombre'
                                      type="text" 
                                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Segundo Nombre"
                                      value = {secondName}
                                      onChange = {e => setSecondName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="Apellido" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Primer Apellido
                                  </label>
                                  <input 
                                    id='Apellido'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Primer Apellido"
                                    value = {lastName}
                                    onChange = {e => setLastName(e.target.value)} 
                                  />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="SegundoApellido" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Segundo Apellido
                                  </label>
                                  <input 
                                    id='SegundoApellido'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Segundo Apellido"
                                    value = {secondLastName}
                                    onChange = {e => setSecondLastName(e.target.value)} 
                                  />
                                </div>

                                <div>
                                  <label 
                                  htmlFor="email" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Email
                                  </label>
                                  <input
                                    autoComplete="on"
                                    id='email' 
                                    type="email" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Email"
                                    value = {email}
                                    onChange = {e => setEmail(e.target.value)}
                                  />
                                </div> 

                                <div>
                                  <label 
                                  htmlFor="phoneNumber" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0"># Teléfono
                                  </label>
                                  <input 
                                    id='phoneNumber'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="# Teléfono"
                                    value = {phoneNumber}
                                    onChange = {e => setPhoneNumber(e.target.value)} 
                                  />
                                </div>     

                                <div>
                                  <label 
                                  htmlFor="address" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Dirección
                                  </label>
                                  <input 
                                    id='address'
                                    type="text" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Dirección"
                                    value = {address}
                                    onChange = {e => setAddress(e.target.value)} 
                                  />
                                </div>  

                                <div>
                                  <label 
                                  htmlFor="dateOfBirth" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Fecha de Nacimiento
                                  </label>
                                  <input 
                                    id='dateOfBirth'
                                    type="Date" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value = {dateOfBirth}
                                    onChange = {e => setDateOfBirth(e.target.value)} 
                                    min={"1925-01-01"}
                                    max={new Date().toISOString().split('T')[0]}
                                  />
                                </div>    

                                <div>
                                  <label 
                                  htmlFor="civilStatus" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Estado Civil
                                  </label>

                                  <select
                                  id="civilStatus"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={civilStatus}
                                  onChange={e => setCivilStatus(e.target.value)}
                                >
                                    <option value="" hidden>Estado Civil</option>
                                    <option value="Soltero/a">Soltero/a</option>
                                    <option value="Casado/a">Casado/a</option>
                                    <option value="Divorciado/a">Divorciado/a</option>
                                    <option value="Viudo/a">Viudo/a</option>
                                  </select>
                              
                                </div>

                                <div>
                                  <label 
                                  htmlFor="typeOfBlood" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Tipo de Sangre
                                  </label>

                                  <select
                                  id="typeOfBlood"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  value={typeOfBlood}
                                  onChange={e => setTypeOfBlood(e.target.value)}
                                >
                                  <option value="" hidden>Tipo de Sangre</option>
                                  <option value="A">A</option>
                                  <option value="A+">A+</option>
                                  <option value="A-">A-</option>
                                  <option value="B">B</option>
                                  <option value="B+">B+</option>
                                  <option value="B-">B-</option>
                                  <option value="AB">AB</option>
                                  <option value="AB+">AB+</option>
                                  <option value="AB-">AB-</option>
                                  <option value="O">O</option>
                                  <option value="O+">O+</option>
                                  <option value="O-">O-</option>

                                </select>                              
                                </div>

                                <div>
                                  <label 
                                  htmlFor="password" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Contraseña
                                  </label>
                                  <input 
                                    id='password'
                                    type="password" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value = {password}
                                    onChange = {e => setPassword(e.target.value)} 
                                  />
                                </div>   

                                <div>
                                  <label 
                                  htmlFor="confirmPassword" 
                                  className="block font-semibold text-gray-700 mt-2 lg:mt-0">Confirmar Contraseña
                                  </label>
                                  <input 
                                    id='confirmPassword'
                                    type="password" 
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value = {confirmPassword}
                                    onChange = {e => setConfirmPassword(e.target.value)} 
                                  />
                                </div> 
                                                                      
                  </div>
                  <div>
                            <div className='flex justify-center my-8'>
                            <input 
                                     checked={legalTerms}
                                     onChange={e => setLegalTerms(!legalTerms)} 
                                     type="checkbox" 
                                     id="legal" 
                                     name="legal" 
                                     />
                                  <label 
                                  className="ml-2 text-sm text-emerald-600 hover:text-emerald-500"
                                  htmlFor="legal">Acepto Términos y Condiciones</label> <br/>
                              </div>
                      <button type="submit" className="w-full font-bold uppercase py-3 bg-emerald-600 text-white hover:bg-emerald-800"> Registrarse </button>
                      <p className="mt-6 text-sm text-grey-600 text-center">¿Ya tienes una cuenta?
                          <Link to="/" className="font-medium ml-2 text-emerald-600 hover:text-emerald-500 ">Inicia sesión</Link>
                      </p>
                  </div>
                </form>
                </div>
              </div>
            </div>
        </div>
      </div>
    )}

    </>
  )
}

export default Register