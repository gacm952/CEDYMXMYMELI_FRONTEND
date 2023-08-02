import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import axios from 'axios'

const Booking = () => {

  const [tipo_documento, setTipo_documento] = useState('')
  const [numero_documento, setNumero_documento] = useState('')
  const [primer_nombre, setPrimer_nombre] = useState('')
  const [segundo_nombre, setSegundo_nombre] = useState('')
  const [primer_apellido, setPrimer_apellido] = useState('')
  const [segundo_apellido, setSegundo_apellido] = useState('')
  const [email, setEmail] = useState('')
  const [numero_telefono, setNumero_telefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [estado_civil, setEstado_civil] = useState('')
  const [fecha_nacimiento, setFecha_nacimiento] = useState('')
  const [tipo_sangre, setTipo_sangre] = useState('')

  const [alert, setAlert] = useState({})

  const handleSubmit = async e => {
      e.preventDefault();

      if ([name, lastName, email, password, confirmPassword].includes('')) {
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

      if (password.length < 6) {
        setAlert({
          msg: 'La contraseña es muy corta, agrega mínimo 6 caracteres',
          error: true,
        })
        return
      }

      setAlert({})

      // Crear el User
      try {
        const { data } = await axios.post('http://localhost:4000/register', // Note: ocultar URL
        {name, lastName, email, password})

        setAlert({
          msg: data.msg,
          error: false
        })

      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

  const {msg} = alert

  return (
    <>
  <section>
        <div className="flex justify-center mx-auto max-w-screen-2xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <div className="grid">
            <div className="flex justify-center max-w-2xl shadow-md bg-white shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
                <div className="p-8 sm:p-16 lg:py-24 lg:px-16 lg:my-12">

                    {/* Title */}

                    <h2 className="text-4xl text-center font-extrabold sm:text-5xl font-poppins text-gray-900 mb-8 capitalize">Agenda tu cita
                    </h2>

                    {msg && <Alert alert={alert}/>}

                    {/* Form */}

                    <form onSubmit={handleSubmit} className="space-y-1">

                    <div className="mt-6 font-poppins"> 
                          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3 mb-2">

                            <div>
                              <label 
                              htmlFor="nombre" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Tipo de Documento
                              </label>
                              <input 
                                id='nombre'
                                type="search"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Tipo de Documento"
                                value = {tipo_documento}
                                onChange = {e => setTipo_documento(e.target.value)} />
                            </div>

                            <div>
                              <label 
                              htmlFor="numdocumento" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Número de Documento
                              </label>
                              <input 
                                id='numdocumento'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Número de Documento"
                                value = {numero_documento}
                                onChange = {e => setNumero_documento(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                              htmlFor="primer_nombre" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Primer Nombre
                              </label>
                              <input 
                                id='primer_nombre'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Correo electrónico"
                                value = {primer_nombre}
                                onChange = {e => setPrimer_nombre(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="segundo_nombre" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0">Segundo Nombre
                              </label>
                              <input 
                                id='segundo_nombre'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Teléfono"
                                value = {segundo_nombre}
                                onChange = {e => setSegundo_nombre(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                              htmlFor="primer_apellido" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Primer Apellido
                              </label>
                              <input 
                                id='primer_apellido'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Primer Apellido"
                                value = {primer_apellido}
                                onChange = {e => setPrimer_apellido(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                              htmlFor="segundo_apellido" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Segundo Apellido
                              </label>
                              <input 
                                id='segundo_apellido'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Segundo Apellido"
                                value = {segundo_apellido}
                                onChange = {e => setSegundo_apellido(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="email" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0"/>Email
                              <input 
                                id='email'
                                autoComplete='on'
                                type="email"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Email"
                                value = {email}
                                onChange = {e => setEmail(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="num_tel" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0"/>Número de teléfono
                              <input 
                                id='num_tel'
                                type="number"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Número de teléfono"
                                value = {numero_telefono}
                                onChange = {e => setNumero_telefono(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="direccion" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0"/>Dirección
                              <input 
                                  id='direccion'
                                  type="text"
                                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Número de teléfono"
                                  value = {direccion}
                                  onChange = {e => setDireccion(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="tipo_sangre" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0"/>Tipo Sangre
                              <input 
                                id='tipo_sangre'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Número de teléfono"
                                value = {tipo_sangre}
                                onChange = {e => setTipo_sangre(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="estadoCivil" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0">Estado Civil
                              </label>
                              <input 
                                id='estadoCivil'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Estado Civil"
                                value = {estado_civil}
                                onChange = {e => setEstado_civil(e.target.value)}/>
                            </div>

                            <div>
                              <label 
                                htmlFor="tipoSangre" 
                                className="block font-medium text-gray-700 mt-2 lg:mt-0">Tipo de sangre
                              </label>
                              <input 
                                id='tipoSangre'
                                type="text"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Tipo de sangre"
                                value = {fecha_nacimiento}
                                onChange = {e => setFecha_nacimiento(e.target.value)}/>
                            </div>     
                          </div>
                      <div>
                            <label 
                              htmlFor="nacimiento" 
                              className="block font-medium text-gray-700 mt-2 lg:mt-0">Fecha de nacimiento
                            </label>
                            <input 
                              id='nacimiento'
                              type="date"
                              className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Fecha de nacimiento"
                              value = {tipo_sangre}
                              onChange = {e => setTipo_sangre(e.target.value)}/>
                      </div>

                        {/* Button submit */}

                          <div>
                            <button 
                            type="submit" 
                            className="mt-4 w-full py-3 bg-emerald-600 text-white hover:bg-emerald-800"> 
                            Agendar
                            </button>
                          </div>
                    </div>

                    </form>
                      
                    <nav className="lg:flex lg:justify-between" >
                          <p className="mt-6 text-sm text-grey-600 text-center">¿Ya tienes una cuenta?
                                <Link to="/Login" className="font-medium text-emerald-600 hover:text-emerald-500 ">Inicia sesión</Link></p>

                          <p className="mt-6 text-sm text-grey-600 text-center">¿No tienes una cuenta?
                            <Link to="/Register" className="font-medium text-emerald-600 hover:text-emerald-500 ml-2">Regístrate </Link></p>
                    </nav>
                  
                </div>
              </div>
            </div>
        </div>
  </section>  
    </>
  )
}

export default Booking