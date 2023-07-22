import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import costumerAxios from '../config/costumerAxios'
import useAuth from '../hooks/useAuth';

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({})
  const navigate = useNavigate()
  const { auth, setAuth } = useAuth();

  const isUser = [auth].some((role) => role.role === "User")
  const isAdmission = [auth].some((role) => role.role === "Admission")

  const handleSubmit = async e => {
    e.preventDefault();

    if([email, password].includes('')) {
      setAlert({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return
    }

    try {
      const { data } = await costumerAxios.post('/login', {email, password})

      setAlert({})
      
      localStorage.setItem('token', data.token)

      setAuth(data)

      setAlert({
        msg: "Bienvenido/a",
        error: false
      })    

      setTimeout(() => {
        if (data.role === "Admission") {
          navigate('/cedym_system')
        } else {
          if (data.role === "User") {
            navigate('/Bookings') 
          }
        }
  
      }, 2000);      

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
    <section className='w-full min-h-screen flex justify-center'>
    <div className="flex justify-center mx-auto max-w-screen-2xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
      <div className="grid">
        <div className="flex justify-center max-w-2xl shadow-md shadow-gray-600 border-2 border-emerald-600 rounded-3xl">  
          <div className="flex justify-center flex-col p-8 sm:p-16 lg:py-24 lg:px-8 lg:mx-12">
            <h2 className="text-4xl uppercase text-center font-extrabold sm:text-5xl font-poppins text-gray-900 mb-8">Inicia Sesión</h2>


            {msg && <Alert alert={alert} />}


            <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-1">
                    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-3">   
                        <div>
                            <label 
                              htmlFor="email" 
                              className="block font-medium text-gray-700">Ingresa Tu Email
                            </label>
                            <input 
                              id="email"
                              type="email" 
                              className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              />
                        </div>

                        <div>
                        <label 
                            htmlFor="password" 
                            className="block font-medium text-gray-700 mt-2 lg:mt-0">Ingresa Tu Contraseña
                            </label>
                            <input 
                            id='password'
                            type="password" 
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                <div>
                   <button type="submit" className="mt-4 w-full py-3 bg-emerald-600 text-white uppercase font-bold hover:bg-emerald-800"> Iniciar Sesión </button>
                    <p className="mt-6 text-sm font-semibold text-center text-grey-600"> <Link to="/forgotPassword" className="text-emerald-600 hover:text-emerald-500">¿Olvidaste Tu Contraseña?</Link></p>
                    <p className="mt-6 text-sm text-grey-600 text-center">¿No Estás Registrado? 
                    <Link to="/Register" className="font-semibold text-emerald-600 hover:text-emerald-500 ml-2 ">Regístrate</Link></p>
                </div>
              </form>
             </div>       
            </div>
          </div>
        </div>
      </div>    
    </section>
  </>

  )
}

export default Login