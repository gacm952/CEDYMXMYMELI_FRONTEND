import { useState } from 'react'
import { Link } from 'react-router-dom'
import costumerAxios from '../config/costumerAxios'
import Alert from "../components/Alert"

const ForgotPassword = () => {

  const [email, setEmail] = useState('')

  const [alert, setAlert] = useState({})

  const handleSubmit = async e => {
    e.preventDefault();

    if (email === '' || email.length < 5 ) {
      setAlert ({
        msg: 'El email es obligatorio',
        error: true
      });
      return
    }   
    try {
      const { data } = await costumerAxios.post(`/resetpassword`, {email})

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
      <div className="flex justify-center mx-auto max-w-screen-xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">      
          <div className="max-w-xl shadow-md bg-white shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
            <div className="p-8 sm:p-32 lg:py-40 lg:px-16 lg:my-12">
                 <h2 className="text-4xl font-extrabold sm:text-5xl font-poppins text-gray-900 mb-12 capitalize">Recupera tu contraseña
              </h2>

              {msg && <Alert alert={alert}/> }

              <div className="mt-6 font-poppins">
                  <form onSubmit={handleSubmit} className="space-y-1">
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block font-medium text-gray-700 mt-2 lg:mt-0">
                          Correo electrónico
                        </label>
                        <input 
                          id='email'
                          type="email"
                          placeholder="Correo electrónico"
                          className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          />
                      </div>
                 
                  <div>
                    <button type="submit" className="mt-4 w-full py-3 bg-emerald-600 text-white hover:bg-emerald-800"> Enviar Instrucciones
                    </button>
                  </div>
                  </form>
                   <nav className="lg:flex lg:justify-between mt-12" >
                    <p className="lg:mt-8 text-sm text-grey-600 text-center">¿Ya tienes una cuenta?
                          <Link to="/" className="font-medium text-emerald-600 hover:text-emerald-500">Inicia sesión</Link></p>

                    <p className="lg:mt-8 text-sm text-grey-600 text-center">¿No tienes una cuenta?
                      <Link to="/Register" className="font-medium text-emerald-600 hover:text-emerald-500 ">Regístrate </Link></p>
                  </nav>
              </div>
            </div>
          </div>
      </div>
      </section>
    </>
  )
}

export default ForgotPassword